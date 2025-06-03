import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class UpdateUnivRequestDto{
  @IsNotEmpty({ message: 'name은 필수 값입니다.' })
  @Expose({ name: 'name' })
  name: string;

  @IsOptional()
  @Expose({ name: 'instagram_url' })
  instagramUrl: string | null;

  @IsNotEmpty({ message: 'leader_id는 필수 값입니다.' })
  @IsNumber({}, { message: 'leader_id는 숫자여야 합니다.' })
  @Type(() => Number)
  @Expose({ name: 'leader_id' })
  leaderId: number;
}