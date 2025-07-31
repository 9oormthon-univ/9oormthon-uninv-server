import { IsNotEmpty, IsNumber, Length, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTeamRequestDto {
  @IsNotEmpty({ message: 'generation은 필수 값입니다.' })
  @Type(() => Number)
  @IsNumber({}, { message: 'generation은 숫자여야 합니다.' })
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  generation: number;

  @IsNotEmpty({ message: 'name은 필수 값입니다.' })
  @Length(0, 255)
  name: string;
}