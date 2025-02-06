import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AdminSignUpDto {
  @ApiProperty({
    description: '시리얼 ID',
    example: 'example@example.com',
  })
  @IsNotEmpty({ message: '아이디를 입력해주세요.' })
  @IsString()
  @Length(6, 20, { message: '아이디는 6~20자리로 입력해주세요.' })
  @Matches(/^[a-z0-9]{6,20}$/, {
    message: '아이디는 소문자 또는 숫자로 이루어진 6자 이상 20자 미만이어야 합니다.',
  })
  @Expose({ name: 'serial_id' })
  serialId: string;

  @ApiProperty({
    description: '비밀번호',
    example: '1234567890a!',
  })
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%]).{10,20}$/, {
    message:
      '비밀번호는 소문자 1개 이상, 숫자 1개 이상, 특수문자(!, @, #, %, $) 1개 이상으로 구성된 10~20자리 비밀번호로 입력해주세요.',
  })
  @Expose({ name: 'password' })
  password: string;

  @ApiProperty({
    description: '어드민 인증 코드',
  })
  @IsNotEmpty({ message: 'admin_auth_code는 null이 될 수 없습니다.' })
  @IsString()
  @Length(6, 20, { message: '어드민 인증 코드는 6~20자리로 입력해주세요.' })
  @Expose({ name: 'admin_auth_code' })
  adminAuthCode: string;
}
