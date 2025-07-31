import { IsEmail, IsNotEmpty, IsNumber, Length, Matches, Max, Min } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class CreateUserRequestDto {
  @IsNotEmpty({ message: 'name은 필수 값입니다.' })
  @Expose({ name: 'name' })
  @Length(0,255)
  name: string;

  @IsNotEmpty({ message: 'univ_id는 필수 값입니다.' })
  @IsNumber({}, { message: 'univ_id는 숫자여야 합니다.' })
  @Type(() => Number)
  @Expose({ name: 'univ_id' })
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  univId: number;

  @IsNotEmpty({ message: 'email은 필수 값입니다.' })
  @IsEmail({}, { message: 'email 형식이 올바르지 않습니다.' })
  @Expose({ name: 'email' })
  @Length(0, 255)
  email: string;

  @IsNotEmpty({ message: 'phone_number는 필수 값입니다.' })
  @Matches(/^\d+$/, { message: 'phone_number는 숫자만 입력해야 합니다.' })
  @Expose({ name: 'phone_number' })
  @Length(0, 255)
  phoneNumber: string;

  @IsNotEmpty({ message: 'generations은 필수 값입니다.' })
  @Expose({ name: 'generations' })
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  generations: number[];
}