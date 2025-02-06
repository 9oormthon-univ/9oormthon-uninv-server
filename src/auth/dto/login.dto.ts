import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LoginDto {
  @ApiProperty({
    description: '시리얼 ID',
    example: 'example@example.com',
  })
  @IsNotEmpty({ message: '아이디를 입력해주세요.' })
  @IsString()
  @Expose({ name: 'serial_id' })
  serialId: string;

  @ApiProperty({
    description: '비밀번호',
    example: '1234567890a!',
  })
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @IsString()
  @Expose({ name: 'password' })
  password: string;
}
