import { IsNotEmpty, IsNumber, IsOptional, Length, Max, Min } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class ReadTeamOverviewQueryDto {
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
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  generation: number;

  // sorting는 선택사항
  @IsOptional()
  @Expose({ name: 'sorting' })
  @Length(1, 20)
  sorting: string;

  // sortType는 선택사항
  @IsOptional()
  @Expose({ name: 'sort-type' })
  @Length(1, 20)
  sortType: string;

  // search는 선택사항
  @IsOptional()
  @Expose({ name: 'search' })
  @Length(0, 100)
  search: string;
}
