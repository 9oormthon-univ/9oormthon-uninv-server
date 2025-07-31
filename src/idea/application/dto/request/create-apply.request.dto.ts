import { IsEnum, IsNotEmpty, Length, Max, Min } from 'class-validator';
import { Expose } from 'class-transformer';
import { ERole } from '../../../../core/enums/role.enum';

export class CreateApplyRequestDto {
  @IsNotEmpty({ message: '몇 차 팀빌딩인지 입력해주세요' })
  @Expose({ name: 'phase'})
  @Min(1, { message: '차수는 1 이상이어야 합니다.' })
  @Max(100, { message: '차수는 100 이하여야 합니다.' })
  phase: number;

  @IsNotEmpty({ message: '지망을 입력해주세요' })
  @Expose({ name: 'preference'})
  @Min(1, { message: '지망은 1 이상이어야 합니다.' })
  @Max(10, { message: '지망은 100 이하여야 합니다.' })
  preference: number;

  @IsNotEmpty({ message: '지원 동기를 입력해주세요' })
  @Expose({ name: 'motivation'})
  @Length(0, 255, { message: '지원 동기는 255자 이하여야 합니다.' })
  motivation: string;

  @IsNotEmpty({ message: '역할을 입력해주세요' })
  @IsEnum(ERole, { message: '역할은 PM, PD, FE, BE 중 하나여야 합니다.' })
  @Expose({ name: 'role'})
  role: ERole;
}