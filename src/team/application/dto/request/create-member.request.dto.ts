import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ERole } from '../../../../core/enums/role.enum';

export class CreateMemberRequestDto {
  @IsNotEmpty({ message: 'user_id는 필수 값입니다.' })
  @IsNumber({}, { message: 'user_id는 숫자여야 합니다.' })
  @Type(() => Number)
  @Expose({ name: 'user_id' })
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  userId: number;

  @IsNotEmpty({ message: 'role는 필수 값입니다.' })
  @Expose({ name: 'role' })
  role: ERole;
}