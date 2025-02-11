import { ApiProperty } from '@nestjs/swagger';
import { ErrorCode } from '../exceptions/error-code';
import { HttpStatus } from '@nestjs/common';

export class ExceptionDto {
  @ApiProperty({
    example: 40404,
    description: '에러 코드',
  })
  code: number;

  @ApiProperty({
    example: '해당 리소스가 존재하지 않습니다.',
    description: '에러 메시지',
  })
  message: string;

  constructor(errorCode: ErrorCode) {
    this.code = errorCode.code;
    this.message = errorCode.message;
  }

  static of(errorCode: ErrorCode): ExceptionDto {
    return new ExceptionDto(errorCode);
  }

}
