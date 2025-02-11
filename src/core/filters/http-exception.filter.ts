import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { CommonException, UnivNotFoundException, ValidationException } from '../exceptions/common.exception';
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
    } else if (exception instanceof UnauthorizedException) { // 3. 인증 예외
      Logger.error("ExceptionFilter catch UnauthorizedException : " + exception.message);
      responseDto = ResponseDto.unAuthorizationFail(exception);
    } else if (exception instanceof UnivNotFoundException) { // 4. 대학교 예외
      Logger.error("ExceptionFilter catch UnivNotFoundException : " + exception.message);
      responseDto = ResponseDto.univNotFoundFail(exception);
    } else { // 5. 나머지 예외
      Logger.error("ExceptionFilter catch Exception : " + exception.message);
      responseDto = ResponseDto.httpFail(exception);
    }

    response.status(responseDto.httpStatus).json(instanceToPlain(responseDto));
  }
}
