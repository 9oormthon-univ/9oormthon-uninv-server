import { IsNotEmpty, IsNumber } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class CreateUnivRequestDto {
  @IsNotEmpty({ message: 'name은 필수 값입니다.' })
  @Expose({ name: 'name' })
  name: string;

  @IsNotEmpty({ message: 'instagram_url은 필수 값입니다.' })
  @Expose({ name: 'instagram_url' })
  instagramUrl: string | null;

  @IsNotEmpty({ message: 'generation은 필수 값입니다.' })
  @IsNumber({}, { message: 'generation은 숫자여야 합니다.' })
  @Type(() => Number)
  @Expose({ name: 'generation' })
  generation: number;
}