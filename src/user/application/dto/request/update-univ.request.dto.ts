import { IsNotEmpty, IsNumber, IsOptional, Length, Max, Min } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class UpdateUnivRequestDto{
  @IsNotEmpty({ message: 'name은 필수 값입니다.' })
  @Expose({ name: 'name' })
  @Length(0, 255)
  name: string;

  @IsOptional()
  @Expose({ name: 'instagram_url' })
  @Length(0, 500)
  instagramUrl: string | null;

  @IsNotEmpty({ message: 'leader_id는 필수 값입니다.' })
  @IsNumber({}, { message: 'leader_id는 숫자여야 합니다.' })
  @Type(() => Number)
  @Expose({ name: 'leader_id' })
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  leaderId: number;
}