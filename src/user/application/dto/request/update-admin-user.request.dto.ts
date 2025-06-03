import { IsNotEmpty, IsNumber } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class UpdateAdminUserRequestDto {

  @IsNotEmpty({ message: 'name은 필수 값입니다.' })
  @Expose({ name: 'name' })
  name: string;

  @IsNotEmpty({ message: 'univ_id는 필수 값입니다.' })
  @IsNumber({}, { message: 'univ_id 숫자여야 합니다.' })
  @Type(() => Number)
  @Expose({ name: 'univ_id' })
  univId: number;

  @IsNotEmpty({ message: 'email은 필수 값입니다.' })
  @Expose({ name: 'email' })
  email: string;

  @IsNotEmpty({ message: 'phone_number는 필수 값입니다.' })
  @Expose({ name: 'phone_number' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'generation은 필수 값입니다.' })
  @IsNumber({}, { message: 'generation은 숫자여야 합니다.' })
  @Type(() => Number)
  @Expose({ name: 'generation' })
  generation: number[];
}