import { IsNotEmpty, IsNumber, IsOptional, IsString, Length, Max, Min } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class ReadUserBriefQueryDto {
  @IsNotEmpty({ message: 'generation은 필수 값입니다.' })
  @Type(() => Number)
  @IsNumber({}, { message: 'generation은 숫자여야 합니다.' })
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  generation: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'team-id는 숫자여야 합니다.' })
  @Expose({ name: 'team-id' })
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  teamId: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'univ-id는 숫자여야 합니다.' })
  @Expose({ name: 'univ-id' })
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  univId: number;

  @IsOptional()
  @IsString()
  @Length(0,255)
  search: string;
}