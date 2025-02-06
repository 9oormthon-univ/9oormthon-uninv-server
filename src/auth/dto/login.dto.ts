import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LoginDto {
  @ApiProperty({
    description: '시리얼 ID',
    example: 'example@example.com',
  })
  @IsNotEmpty({ message: 'serial_id는 null이 될 수 없습니다.' })
  @IsString()
  @Length(6, 20, { message: '시리얼 ID는 6~20자리로 입력해주세요.' })
  @Matches(/^[a-z0-9]{6,20}$/, {
    message: '소문자 또는 숫자로 이루어진 6자 이상 20자 미만이어야 합니다.',
  })
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
