import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class ReadTeamOverviewQueryDto {
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
  @Expose({ name: 'search' })
  search: string;
}
