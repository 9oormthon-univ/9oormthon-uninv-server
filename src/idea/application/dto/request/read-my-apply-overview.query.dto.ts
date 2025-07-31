import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ReadMyApplyOverviewQueryDto {
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
}