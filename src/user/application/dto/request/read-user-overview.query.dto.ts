// src/idea/dto/query/read-idea-overview-query.dto.ts
import { IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsString } from 'class-validator';
import { Expose, Type, Transform } from 'class-transformer';

export class ReadUserOverviewQueryDto {
  @IsNotEmpty({ message: 'page는 필수 값입니다.' })
  @Type(() => Number)
  @IsNumber({}, { message: 'page는 숫자여야 합니다.' })
  page: number;

  @IsNotEmpty({ message: 'size는 필수 값입니다.' })
  @Type(() => Number)
  @IsNumber({}, { message: 'size는 숫자여야 합니다.' })
  size: number;

  @IsNotEmpty({ message: 'generation은 필수 값입니다.' })
  @Type(() => Number)
  @IsNumber({}, { message: 'generation은 숫자여야 합니다.' })
  generation: number;

  // univId는 선택사항
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'univ-id는 숫자여야 합니다.' })
  @Expose({ name: 'univ-id' })
  univId?: number;

  // sorting는 선택사항
  @IsOptional()
  @Expose({ name: 'sorting' })
  sorting: string;

  // sortType는 선택사항
  @IsOptional()
  @Expose({ name: 'sort-type' })
  sortType: string;

  // search는 선택사항
  @IsOptional()
  @IsString()
  search: string;
}
