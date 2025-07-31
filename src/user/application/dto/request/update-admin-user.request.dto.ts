import { IsNotEmpty, IsNumber, Length, Max, Min } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class UpdateAdminUserRequestDto {

  @IsNotEmpty({ message: 'img_url은 필수 값입니다.' })
  @Expose({ name: 'img_url' })
  @Length(0, 500)
  imgUrl: string;

  @IsNotEmpty({ message: 'name은 필수 값입니다.' })
  @Expose({ name: 'name' })
  @Length(0, 255)
  name: string;

  @IsNotEmpty({ message: 'univ_id는 필수 값입니다.' })
  @IsNumber({}, { message: 'univ_id 숫자여야 합니다.' })
  @Type(() => Number)
  @Expose({ name: 'univ_id' })
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  univId: number;

  @IsNotEmpty({ message: 'email은 필수 값입니다.' })
  @Expose({ name: 'email' })
  @Length(0, 255)
  email: string;

  @IsNotEmpty({ message: 'phone_number는 필수 값입니다.' })
  @Expose({ name: 'phone_number' })
  @Length(0, 255)
  phoneNumber: string;

  @IsNotEmpty({ message: 'generations은 필수 값입니다.' })
  @Expose({ name: 'generations' })
  generations: number[];
}