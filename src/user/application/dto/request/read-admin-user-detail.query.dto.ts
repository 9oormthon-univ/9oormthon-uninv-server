import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class ReadAdminUserDetailQueryDto {
  @IsNotEmpty({ message: 'generation은 필수 값입니다.' })
  @Type(() => Number)
  @IsNumber({}, { message: 'generation은 숫자여야 합니다.' })
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  generation: number;
}