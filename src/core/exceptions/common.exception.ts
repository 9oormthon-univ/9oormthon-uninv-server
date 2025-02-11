import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-code';

export class CommonException extends HttpException {
  constructor(public readonly errorCode: ErrorCode) {
    super(
      {
        success: false,
        data: null,
        error: {
          code: errorCode.code,
          message: errorCode.message,
        },
      },
      errorCode.httpStatus,
    );
  }
}

export class ValidationException extends CommonException {
  constructor(errorMessages: string[]) {
    super({
      code: 40011,
      message: errorMessages.join(', '),
      httpStatus: HttpStatus.BAD_REQUEST,
    } as ErrorCode);
  }
}

export class UnivNotFoundException extends CommonException {
  constructor(univ: string) {
    super({
      code: 40405,
      message: univ + '가 데이터베이스 상에 존재하지 않습니다.',
      httpStatus: HttpStatus.NOT_FOUND,
    } as ErrorCode);
  }
}
