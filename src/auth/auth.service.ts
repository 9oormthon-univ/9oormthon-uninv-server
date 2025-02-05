import { Injectable, UseFilters } from '@nestjs/common';
import { UserRepository } from '../database/repositories/user.repository';
import { AuthSignUpDto } from './dto/auth-sign-up.dto';
import { JwtTokenDto } from './dto/jwt-token.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { CommonException } from '../common/exceptions/common.exception';
import { ErrorCode } from '../common/exceptions/error-code';
import * as XLSX from 'xlsx';
import { BadRequestException } from '@nestjs/common/exceptions';
import { User } from '../database/entities/user.entity';
import { DataSource } from 'typeorm';
import { Univ } from '../database/entities/univ.entity';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource,
  ) {
  }

  async signUp(file: Express.Multer.File): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      const users: User[] = [];
      const univRepo = manager.getRepository(Univ);
      const userRepo = manager.getRepository(User);

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
          throw new BadRequestException(row[2] + ' 학교가 존재하지 않습니다.');
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

  async login(authSignUpDto: AuthSignUpDto): Promise<JwtTokenDto> {
    return this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const user = await this.userRepository.findOne({
        where: { serialId: authSignUpDto.serialId },
      });

      if (!user) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      const isPasswordValid = await bcrypt.compare(
        authSignUpDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new CommonException(ErrorCode.FAILURE_LOGIN);
      }

      const tokens = this.generateTokens(user.id);
      user.refreshToken = tokens.refreshToken;
      user.isLogin = true;
      await userRepo.save(user);

      return tokens;
    });
  }

  async logout(userId: number): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (user) {
        user.refreshToken = null;
        user.isLogin = false;
        await userRepo.save(user);
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
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
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

  async reissue(userId: number, refreshToken: string): Promise<JwtTokenDto> {
    return this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const user = await this.userRepository.findOne({
        where: { id: userId, refreshToken, isLogin: true },
      });

      if (!user) {
        throw new Error('User not found or not logged in');
      }

      const tokens = this.generateTokens(user.id);
      user.refreshToken = tokens.refreshToken;
      await userRepo.save(user);

      return tokens;
    });
  }

  private generateTokens(userId: number): JwtTokenDto {
    const payload = { userId };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' }); // accessToken 1시간 유효
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '14d' }); // refreshToken 14일 유효

    return { accessToken, refreshToken };
  }
}
