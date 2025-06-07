import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class RandomizeTeamNumberQueryDto {
  @IsNotEmpty({ message: 'generation은 필수 값입니다.' })
  @Type(() => Number)
  @IsNumber({}, { message: 'generation은 숫자여야 합니다.' })
  generation: number;
}