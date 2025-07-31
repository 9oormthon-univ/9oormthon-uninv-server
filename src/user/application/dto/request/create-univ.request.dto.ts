import { IsNotEmpty, IsNumber, Length, Max, Min } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class CreateUnivRequestDto {
  @IsNotEmpty({ message: 'name은 필수 값입니다.' })
  @Expose({ name: 'name' })
  @Length(0,255)
  name: string;

  @IsNotEmpty({ message: 'instagram_url은 필수 값입니다.' })
  @Expose({ name: 'instagram_url' })
  @Length(0, 255)
  instagramUrl: string | null;

  @IsNotEmpty({ message: 'generation은 필수 값입니다.' })
  @IsNumber({}, { message: 'generation은 숫자여야 합니다.' })
  @Type(() => Number)
  @Expose({ name: 'generation' })
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  generation: number;
}