import { IsEnum, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { ERole } from '../../../../core/enums/role.enum';

export class CreateApplyRequestDto {
  @IsNotEmpty({ message: '몇 차 팀빌딩인지 입력해주세요' })
  @Expose({ name: 'phase'})
  phase: number;

  @IsNotEmpty({ message: '지망을 입력해주세요' })
  @Expose({ name: 'preference'})
  preference: number;

  @IsNotEmpty({ message: '지원 동기를 입력해주세요' })
  @Expose({ name: 'motivation'})
  motivation: string;

  @IsNotEmpty({ message: '역할을 입력해주세요' })
  @IsEnum(ERole, { message: '역할은 PM, PD, FE, BE 중 하나여야 합니다.' })
  @Expose({ name: 'role'})
  role: ERole;
}