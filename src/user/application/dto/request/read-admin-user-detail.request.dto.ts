import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class ReadAdminUserDetailRequestDto {
  @IsNotEmpty({ message: 'generation은 필수 값입니다.' })
  @Type(() => Number)
  @IsNumber({}, { message: 'generation은 숫자여야 합니다.' })
  generation: number;
}