import { HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Exclude, Type } from 'class-transformer';
import { ExceptionDto } from './exception.dto';
import { CommonException, UnivNotFoundException, ValidationException } from '../exceptions/common.exception';
import { ErrorCode } from '../exceptions/error-code';

export class ResponseDto<T> {
  @Exclude()
  httpStatus?: HttpStatus;

  @ApiProperty({ description: 'API 호출 성공 여부' })
  @IsBoolean()
  success: boolean;

  @ApiPropertyOptional({ description: 'API 호출 성공 시 응답 데이터' })
  @IsOptional()
  data?: T;

  @ApiPropertyOptional({ description: 'API 호출 실패 시 응답 에러' })
  @IsOptional()
  @ValidateNested()
  @Type(() => ExceptionDto)
  error?: ExceptionDto = null;

  constructor(
    httpStatus: HttpStatus,
    success: boolean,
    data?: T,
    error?: ExceptionDto,
  ) {
    this.httpStatus = httpStatus;
    this.success = success;
    this.data = data;
    this.error = error === undefined ? null : error;
  }

  static ok<T>(data?: T): ResponseDto<T> {
    return new ResponseDto(HttpStatus.OK, true, data);
  }

  static created<T>(data?: T): ResponseDto<T> {
    return new ResponseDto(HttpStatus.CREATED, true, data);
  }

  static commonFail(error: CommonException): ResponseDto<null> {
    return new ResponseDto(
      error.getStatus(),
      false,
      null,
      ExceptionDto.of(error.errorCode),
    );
  }

  static validationFail(error: ValidationException): ResponseDto<null> {
    return new ResponseDto(
      error.getStatus(),
      false,
      null,
      ExceptionDto.of(error.errorCode),
    );
  }

  static unAuthorizationFail(error: UnauthorizedException): ResponseDto<null> {
    return new ResponseDto(
      error.getStatus(),
      false,
      null,
      ExceptionDto.of(ErrorCode.NOT_FOUND_AUTHORIZATION_COOKIE),
    );
  }

  static univNotFoundFail(error: UnivNotFoundException): ResponseDto<null> {
    return new ResponseDto(
      error.getStatus(),
      false,
      null,
      ExceptionDto.of(error.errorCode),
    );
  }

  static httpFail(error: HttpException): ResponseDto<null> {
    return new ResponseDto(
      error.getStatus(),
      false,
      null,
      ExceptionDto.of(ErrorCode.INTERNAL_SERVER_ERROR),
    );
  }
}
