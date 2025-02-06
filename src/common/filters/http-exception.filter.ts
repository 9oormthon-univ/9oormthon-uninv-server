import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';
import { CommonException, ValidationException } from '../exceptions/common.exception';
import { ResponseDto } from '../dto/response.dto';
import { instanceToPlain } from 'class-transformer';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let responseDto: ResponseDto<null>;

    if (exception instanceof CommonException) {     // 1. 개발자가 직접 정의한 예외
      Logger.error("ExceptionFilter catch CommonException : " + exception.message);
      responseDto = ResponseDto.commonFail(exception);
    } else if (exception instanceof ValidationException) { // 2. 유효성 검사 예외
      Logger.error("ExceptionFilter catch ValidationException : " + exception.message);
      responseDto = ResponseDto.validationFail(exception);
    } else { // 3. 나머지 예외
      Logger.error("ExceptionFilter catch Exception : " + exception.message);
      responseDto = ResponseDto.httpFail(exception);
    }

    response.status(responseDto.httpStatus).json(instanceToPlain(responseDto));
  }
}
