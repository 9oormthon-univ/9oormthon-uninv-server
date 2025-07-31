import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LoginRequestDto {
  @ApiProperty({
    description: '시리얼 ID',
    example: 'example@example.com',
  })
  @IsNotEmpty({ message: '아이디를 입력해주세요.' })
  @IsString()
  @Expose({ name: 'serial_id' })
  @Length(6, 255, { message: '아이디는 6자 이상 255자 이하로 입력해주세요.' })
  serialId: string;

  @ApiProperty({
    description: '비밀번호',
    example: '1234567890a!',
  })
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @IsString()
  @Expose({ name: 'password' })
  @Length(10, 20, { message: '비밀번호는 10자 이상 20자 이하로 입력해주세요.' })
  password: string;
}
