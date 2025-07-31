import { IsInt, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export function ToNumberOrUndefined() {
  return Transform(({ value }) => {
    if (value === '') {
      return undefined;
    }
    return Number(value);
  });
}

export class ReadAuthBriefQueryDto {
  @IsInt({ message: 'generation은 필수이며, 숫자여야 합니다.' })
  @Min(1, { message: 'generation은 1 이상이어야 합니다.' })
  @Max(100, { message: 'generation은 100 이하여야 합니다.' })
  @ToNumberOrUndefined()
  generation: number;
}