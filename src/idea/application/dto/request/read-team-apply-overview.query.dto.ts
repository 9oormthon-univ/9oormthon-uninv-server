import { IsNotEmpty, IsNumber } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { Optional } from '@nestjs/common';

export class ReadTeamApplyOverviewQueryDto {
  @IsNotEmpty({ message: 'generation은 필수 값입니다.' })
  @Type(() => Number)
  @IsNumber({}, { message: 'generation은 숫자여야 합니다.' })
  generation: number;

  @IsNotEmpty({ message: 'phase는 필수 값입니다.' })
  @Type(() => Number)
  @IsNumber({}, { message: 'phase는 숫자여야 합니다.' })
  phase: number;

  @Optional()
  @Expose({ name: 'sorting' })
  sorting: string;

  @Optional()
  @Expose({name: 'sort-type'})
  sortType: string;
}