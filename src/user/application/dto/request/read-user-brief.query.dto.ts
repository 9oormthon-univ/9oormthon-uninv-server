import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class ReadUserBriefQueryDto {
  @IsNotEmpty({ message: 'generation은 필수 값입니다.' })
  @Type(() => Number)
  @IsNumber({}, { message: 'generation은 숫자여야 합니다.' })
  generation: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'univ-id는 숫자여야 합니다.' })
  @Expose({ name: 'univ-id' })
  univId: number;

  @IsOptional()
  @IsString()
  search: string;
}