import { IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export function ToNumberOrUndefined() {
  return Transform(({ value }) => {
    if (value === '') {
      return undefined;
    }
    return Number(value);
  });
}

export class ReadAuthBriefRequestDto {
  @IsInt({ message: 'generation은 필수이며, 숫자여야 합니다.' })
  @ToNumberOrUndefined()
  generation: number;
}