import { Injectable, UseFilters } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { CommonException, UnivNotFoundException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import * as XLSX from 'xlsx';
import { DataSource } from 'typeorm';
import { ESecurityRole } from '../../../core/enums/security-role.enum';
import { UserRepository } from '../../../user/repository/user.repository';
import { UserModel } from '../../../user/domain/user.model';
import { UnivRepository } from '../../../user/repository/univ.repository';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class SignUpService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly univRepository: UnivRepository,
    private readonly dataSource: DataSource,
  ) {
  }

  async execute(userId: number, file: Express.Multer.File): Promise<void> {
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
}
