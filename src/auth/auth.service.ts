import { Injectable, UseFilters } from '@nestjs/common';
import { UserRepository } from '../database/repositories/user.repository';
import { AdminSignUpDto } from './dto/admin-sign-up.dto';
import { JwtTokenDto } from './dto/jwt-token.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { CommonException, UnivNotFoundException } from '../common/exceptions/common.exception';
import { ErrorCode } from '../common/exceptions/error-code';
import * as XLSX from 'xlsx';
import { User } from '../database/entities/user.entity';
import { DataSource } from 'typeorm';
import { Univ } from '../database/entities/univ.entity';
import { ESecurityRole } from '../database/enums/security-role.enum';
import { LoginDto } from './dto/login.dto';
import { AuthBriefsDto } from './dto/auth-briefs.dto';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource,
  ) {
  }

  async login(loginDto: LoginDto): Promise<JwtTokenDto> {
    return this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const user = await this.userRepository.findOne({
        where: { serialId: loginDto.serialId },
      });

      // 입력한 아이디에 해당하는 사용자가 존재하지 않을 경우 예외 발생
      if (!user) {
        throw new CommonException(ErrorCode.FAILURE_LOGIN);
      }

      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new CommonException(ErrorCode.FAILURE_LOGIN);
      }

      const tokens = this.generateTokens(user.id, user.role);
      user.refreshToken = tokens.refreshToken;
      await userRepo.save(user);

      return tokens;
    });
  }

  async logout(refreshToken: string): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);

      let payload: any;
      try {
        payload = this.jwtService.verify(refreshToken, {
          secret: process.env.JWT_SECRET,
        })
      } catch (error) {
        throw new CommonException(ErrorCode.INVALID_TOKEN_ERROR);
      }

      const { userId, role } = payload;

      const user = await this.userRepository.findOne({ where: { refreshToken, id: userId, role } });
      if (!user) {
        throw new CommonException(ErrorCode.NOT_FOUND_LOGIN_USER);
      }
      user.refreshToken = null;
      await userRepo.save(user);
    });
  }

  async signUpAdmin(authSignUpDto: AdminSignUpDto): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);

      // 어드민 코드가 일치하지 않을 경우 예외 발생
      if (authSignUpDto.adminAuthCode !== process.env.ADMIN_AUTH_CODE) {
        throw new CommonException(ErrorCode.INVALID_ADMIN_AUTH_CODE);
      }

      // 이미 존재하는 아이디라면 예외 발생
      const user = await userRepo.findOne({
        where: { serialId: authSignUpDto.serialId },
      });

      if (user) {
        throw new CommonException(ErrorCode.ALREADY_EXISTS_USER);
      }

      // 어드민 계정 생성
      const newUser = new User();
      newUser.serialId = authSignUpDto.serialId;
      newUser.password = await bcrypt.hash(authSignUpDto.password, 10);
      newUser.generations = [];
      newUser.name = authSignUpDto.serialId;
      newUser.phoneNumber = authSignUpDto.serialId;
      newUser.imgUrl = process.env.ADMIN_DEFAULT_PROFILE_IMG_URL;
      newUser.role = ESecurityRole.ADMIN;

      await userRepo.save(newUser);
    });
  }

  async signUp(userId: number, file: Express.Multer.File): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      const users: User[] = [];
      const univRepo = manager.getRepository(Univ);
      const userRepo = manager.getRepository(User);

      const admin = await this.userRepository.findOne({ where: { id: userId } });

      if (!admin || admin.role !== ESecurityRole.ADMIN) {
        throw new CommonException(ErrorCode.ACCESS_DENIED);
      }

      if (!file) {
        throw new CommonException(ErrorCode.MISSING_REQUEST_PARAMETER);
      }

      // 버퍼로부터 Workbook 생성
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });

      // 첫 번째 시트 추출
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const unfilteredExcelData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      });

      // 빈 행 제거
      const excelData = unfilteredExcelData.filter((row) =>
        row.some(
          (cell) =>
            cell !== null &&
            cell !== undefined &&
            cell.toString().trim() !== '',
        ),
      );

      // 첫 행이 헤더라고 가정. i=1부터 끝까지 순회
      for (let i = 1; i < excelData.length; i++) {
        const row = excelData[i];
        // row[0] = 이름, row[1] = 기수, row[2] = 학교, row[3] = 이메일, row[4] = 전화번호
        const univ = await univRepo.findOne({
          where: { name: row[2] },
        });

        // 없는 학교 명 입력했을 경우 예외발생
        if (!univ) {
          throw new UnivNotFoundException(row[2]);
        }

        // 기존 사용자가 아니라면 새롭게 생성
        let user = await this.userRepository.findOne({
          where: { phoneNumber: row[4], univ: univ },
        });
        if (user === null) {
          const generation = [];
          generation.push(row[1]);

          user = new User();
          user.name = row[0];
          user.generations = generation;
          user.univ = univ;
          user.serialId = row[3];
          user.phoneNumber = row[4];
          user.password = await bcrypt.hash(row[4], 10);
          user.imgUrl = process.env.USER_DEFAULT_PROFILE_IMG_URL;
          users.push(user);
        } else {
          // 기존 사용자라면 기수만 추가
          user.generations.push(row[1]);
          users.push(user);
        }
      }

      await userRepo.save(users);
    });
  }

  async reissue(refreshToken?: string): Promise<JwtTokenDto> {
    return this.dataSource.transaction(async (manager) => {
      try {
        const { userId, role } = this.jwtService.verify(refreshToken, {
          secret: process.env.JWT_SECRET,
        });

        const userRepo = manager.getRepository(User);
        const user = await this.userRepository.findOne({
          where: { id: userId, refreshToken, role: role },
        });

        const tokens = this.generateTokens(user.id, role);
        user.refreshToken = tokens.refreshToken;
        await userRepo.save(user);

        return tokens;
      } catch (error) {
        throw new CommonException(ErrorCode.INVALID_TOKEN_ERROR);
      }
    });
  }

  async changePassword(
    userId: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new CommonException(ErrorCode.NOT_FOUND_RESOURCE);
      }

      const isPasswordValid = await bcrypt.compare(
        changePasswordDto.currentPassword,
        user.password,
      );

      if (!isPasswordValid) {
        throw new CommonException(ErrorCode.FAILURE_CHANGE_PASSWORD);
      }

      user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
      await userRepo.save(user);
    });
  }

  async getAuthBriefs(accessToken: string): Promise<any> {
    return this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      let payload: any;

      try {
        payload = this.jwtService.verify(accessToken, {
          secret: process.env.JWT_SECRET,
        });
      } catch (error) {
        return AuthBriefsDto.of(ESecurityRole.GUEST, null);
      }

      const { userId, role } = payload;
      const user = await userRepo.findOne({ where: { id: userId, role } });
      if (!user) {
        throw new CommonException(ErrorCode.NOT_FOUND_LOGIN_USER);
      }
      return AuthBriefsDto.of(user.role, user.name);
    });
  }

  private generateTokens(userId: number, role: ESecurityRole): JwtTokenDto {
    const payload = { userId, role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' }); // accessToken 1시간 유효
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '14d' }); // refreshToken 14일 유효

    return { accessToken, refreshToken };
  }
}
