// src/idea/dto/query/read-idea-overview-query.dto.ts
import { IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsString, Min, Max, Length } from 'class-validator';
import { Expose, Type, Transform } from 'class-transformer';

export class ReadUserOverviewQueryDto {
  @IsNotEmpty({ message: 'page는 필수 값입니다.' })
  @Type(() => Number)
  @IsNumber({}, { message: 'page는 숫자여야 합니다.' })
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  page: number;

  @IsNotEmpty({ message: 'size는 필수 값입니다.' })
  @Type(() => Number)
  @IsNumber({}, { message: 'size는 숫자여야 합니다.' })
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  size: number;

  @IsNotEmpty({ message: 'generation은 필수 값입니다.' })
  @Type(() => Number)
  @IsNumber({}, { message: 'generation은 숫자여야 합니다.' })
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  generation: number;

  // univId는 선택사항
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'univ-id는 숫자여야 합니다.' })
  @Expose({ name: 'univ-id' })
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  univId?: number;

  // sorting는 선택사항
  @IsOptional()
  @Expose({ name: 'sorting' })
  @Length(0,255)
  sorting: string;

  // sortType는 선택사항
  @IsOptional()
  @Expose({ name: 'sort-type' })
  @Length(0, 255)
  sortType: string;

  // search는 선택사항
  @IsOptional()
  @IsString()
  @Length(0, 255)
  search: string;
}
