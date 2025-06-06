import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class ReadAdminUserDetailQueryDto {
  @IsNotEmpty({ message: 'generations은 필수 값입니다.' })
  @Type(() => Number)
  @IsNumber({}, { message: 'generations은 숫자여야 합니다.' })
  generations: number;
}