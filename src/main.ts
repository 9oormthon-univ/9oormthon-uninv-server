import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ValidationException } from './core/exceptions/common.exception';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const error = errors[0];
        let message = 'Validation error occurred';

        if (error.constraints) {
          message = Object.values(error.constraints)[0];
        } else if (error.children && error.children.length > 0) {
          const child = error.children[0];
          if (child.constraints) {
            message = Object.values(child.constraints)[0];
          }
          return new ValidationException([message]);
        }
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
