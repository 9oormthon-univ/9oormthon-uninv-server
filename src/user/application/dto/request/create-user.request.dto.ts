import { IsEmail, IsNotEmpty, IsNumber, Matches } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class CreateUserRequestDto {
  @IsNotEmpty({ message: 'name은 필수 값입니다.' })
  @Expose({ name: 'name' })
  name: string;

  @IsNotEmpty({ message: 'univ_id는 필수 값입니다.' })
  @IsNumber({}, { message: 'univ_id는 숫자여야 합니다.' })
  @Type(() => Number)
  @Expose({ name: 'univ_id' })
  univId: number;

  @IsNotEmpty({ message: 'email은 필수 값입니다.' })
  @IsEmail({}, { message: 'email 형식이 올바르지 않습니다.' })
  @Expose({ name: 'email' })
  email: string;

  @IsNotEmpty({ message: 'phone_number는 필수 값입니다.' })
  @Matches(/^\d+$/, { message: 'phone_number는 숫자만 입력해야 합니다.' })
  @Expose({ name: 'phone_number' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'generations은 필수 값입니다.' })
  @Expose({ name: 'generations' })
  generations: number[];
}