import { Injectable, UseFilters } from '@nestjs/common';
import { AdminSignUpRequestDto } from './dto/request/admin-sign-up.request.dto';
import { ReissueJwtTokenResponseDto } from './dto/response/reissue-jwt-token.response.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UpdatePasswordRequestDto } from './dto/request/update-password.request.dto';
import { HttpExceptionFilter } from '../core/filters/http-exception.filter';
import { CommonException, UnivNotFoundException } from '../core/exceptions/common.exception';
import { ErrorCode } from '../core/exceptions/error-code';
import * as XLSX from 'xlsx';
import { DataSource } from 'typeorm';
import { ESecurityRole } from '../core/enums/security-role.enum';
import { LoginRequestDto } from './dto/request/login.request.dto';
import { ReadAuthBriefsResponseDto } from './dto/response/read-auth-briefs.response.dto';
import { UserRepositoryImpl } from '../user/repository/user.repository.impl';
import { UserModel } from '../user/domain/user.model';
import { UnivRepositoryImpl } from '../user/repository/univ.repository.impl';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepositoryImpl,
    private readonly univRepository: UnivRepositoryImpl,
    private readonly dataSource: DataSource,
  ) {
  }

  async login(loginDto: LoginRequestDto): Promise<ReissueJwtTokenResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      const user = await this.userRepository.findBySerialId(loginDto.serialId, manager);

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
      const updatedUser = user.updateRefreshToken(tokens.refreshToken);
      await this.userRepository.save(updatedUser);

      return tokens;
    });
  }

  async logout(refreshToken: string): Promise<void> {
    return this.dataSource.transaction(async (manager) => {

      let payload: any;
      try {
        payload = this.jwtService.verify(refreshToken, {
          secret: process.env.JWT_SECRET,
        })
      } catch (error) {
        throw new CommonException(ErrorCode.INVALID_TOKEN_ERROR);
      }

      const { userId, role } = payload;

      const user = await this.userRepository.findByRefreshTokenAndId(refreshToken, userId, manager);
      if (!user) {
        throw new CommonException(ErrorCode.NOT_FOUND_LOGIN_USER);
      }
      const updatedUser = user.updateRefreshToken(null);
      await this.userRepository.save(updatedUser);
    });
  }

  async signUpAdmin(authSignUpDto: AdminSignUpRequestDto): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      // 어드민 코드가 일치하지 않을 경우 예외 발생
      if (authSignUpDto.adminAuthCode !== process.env.ADMIN_AUTH_CODE) {
        throw new CommonException(ErrorCode.INVALID_ADMIN_AUTH_CODE);
      }

      // 이미 존재하는 아이디라면 예외 발생
      const user = await this.userRepository.findBySerialId(authSignUpDto.serialId, manager);
      if (user) {
        throw new CommonException(ErrorCode.ALREADY_EXISTS_USER);
      }

      // 어드민 계정 생성
      const newUser = UserModel.createAdmin(
        authSignUpDto.serialId,
        await bcrypt.hash(authSignUpDto.password, 10),
      )

      await this.userRepository.save(newUser);
    });
  }

  async signUp(userId: number, file: Express.Multer.File): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      const users: UserModel[] = [];

      const admin = await this.userRepository.findByIdWithUniv(userId, manager);

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
        const univ = await this.univRepository.findByName(row[2]);

        // 없는 학교 명 입력했을 경우 예외발생
        if (!univ) {
          throw new UnivNotFoundException(row[2]);
        }

        // 기존 사용자가 아니라면 새롭게 생성
        let user = await this.userRepository.findByPhoneNumberAndUniv(row[4], univ.id, manager);
        if (user === null) {
          const generation = [];
          generation.push(row[1]);

          const user = UserModel.createUser(
            row[3],
            await bcrypt.hash(row[4], 10),
            process.env.USER_DEFAULT_PROFILE_IMG_URL,
            row[0],
            row[4],
            generation,
            univ,
          )
          users.push(user);
        } else {
          // 기존 사용자라면 기수만 추가
          user.generations.push(row[1]);
          users.push(user);
        }
      }

      await this.userRepository.saveAll(users);
    });
  }

  async reissue(refreshToken?: string): Promise<ReissueJwtTokenResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      try {
        const { userId, role } = this.jwtService.verify(refreshToken, {
          secret: process.env.JWT_SECRET,
        });

        const user = await this.userRepository.findByIdAndRefreshTokenAndRole(userId, refreshToken, role, manager);

        const tokens = this.generateTokens(user.id, role);
        const updatedUser = user.updateRefreshToken(tokens.refreshToken);
        await this.userRepository.save(updatedUser);

        return tokens;

      } catch (error) {
        throw new CommonException(ErrorCode.INVALID_TOKEN_ERROR);
      }
    });
  }

  async changePassword(
    userId: number,
    changePasswordDto: UpdatePasswordRequestDto,
  ): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      const user = await this.userRepository.findByIdWithUniv(userId, manager);
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

      const updatedUser = user.updatePassword(await bcrypt.hash(changePasswordDto.newPassword, 10));
      await this.userRepository.save(updatedUser);
    });
  }

  async getAuthBriefs(accessToken: string): Promise<any> {
    return this.dataSource.transaction(async (manager) => {
      let payload: any;

      try {
        payload = this.jwtService.verify(accessToken, {
          secret: process.env.JWT_SECRET,
        });
      } catch (error) {
        return ReadAuthBriefsResponseDto.of(ESecurityRole.GUEST, null);
      }

      const { userId, role } = payload;
      const user = await this.userRepository.findByIdAndRole(userId, role, manager);
      if (!user) {
        throw new CommonException(ErrorCode.NOT_FOUND_LOGIN_USER);
      }
      return ReadAuthBriefsResponseDto.of(user.role, user.name);
    });
  }

  private generateTokens(userId: number, role: ESecurityRole): ReissueJwtTokenResponseDto {
    const payload = { userId, role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' }); // accessToken 1시간 유효
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '14d' }); // refreshToken 14일 유효

    return { accessToken, refreshToken };
  }
}
