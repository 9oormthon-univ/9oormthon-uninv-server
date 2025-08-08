import { IsNotEmpty, IsNumber, IsOptional, Length, Max, Min } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class ReadTeamApplyOverviewQueryDto {
  @IsNotEmpty({ message: 'generation은 필수 값입니다.' })
  @Type(() => Number)
  @IsNumber({}, { message: 'generation은 숫자여야 합니다.' })
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  generation: number;

  @IsNotEmpty({ message: 'phase는 필수 값입니다.' })
  @Type(() => Number)
  @IsNumber({}, { message: 'phase는 숫자여야 합니다.' })
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  phase: number;

  @IsOptional()
  @Expose({ name: 'sorting' })
  @Length(0, 100)
  sorting: string;

  @IsOptional()
  @Expose({name: 'sort-type'})
  @Length(0, 20)
  sortType: string;
}