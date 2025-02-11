import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UpdatePasswordRequestDto {
  @ApiProperty({
    description: '현재 비밀번호',
    example: '1234567890a!',
  })
  @IsNotEmpty({ message: '기존 비밀번호를 입력해주세요.' })
  @IsString()
  @Expose({ name: 'current_password' })
  currentPassword: string;
  @ApiProperty({
    description: '비밀번호',
    example: '1234567890a!',
  })
  @IsNotEmpty({ message: '새로운 비밀번호를 입력해주세요.' })
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%]).{10,20}$/, {
    message:
      '비밀번호는 소문자 1개 이상, 숫자 1개 이상, 특수문자(!, @, #, %, $) 1개 이상으로 구성된 10~20자리 비밀번호로 입력해주세요.',
  })
  @Expose({ name: 'new_password' })
  newPassword: string;
}
