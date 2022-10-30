import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
// import { Request, Response } from 'express';
import { HttpResponse } from '../types';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger = new Logger('HTTP');

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    this.logger.log(exception);
    if (!(exception instanceof HttpException)) {
      exception = new HttpException(
        exception,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const errorMessage = exception.getResponse();
    const errorResponse: HttpResponse = {
      isSuccess: false,
      error:
        typeof errorMessage == 'object'
          ? errorMessage['message']
          : errorMessage,
    };
    httpAdapter.reply(ctx.getResponse(), errorResponse, exception.getStatus());
  }
}
