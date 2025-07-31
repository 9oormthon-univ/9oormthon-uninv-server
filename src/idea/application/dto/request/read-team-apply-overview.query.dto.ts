import { IsNotEmpty, IsNumber, Length, Max, Min } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { Optional } from '@nestjs/common';

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

  @Optional()
  @Expose({ name: 'sorting' })
  @Length(0, 100)
  sorting: string;

  @Optional()
  @Expose({name: 'sort-type'})
  @Length(0, 20)
  sortType: string;
}