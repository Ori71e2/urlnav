import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { IResponse } from '../interfaces/response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter, IResponse {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let status = (exception instanceof HttpException) ? exception.getStatus(): HttpStatus.INTERNAL_SERVER_ERROR;

    // if (status === HttpStatus.UNAUTHORIZED) 
    //     return response.status(status).render('views/401');
    // if (status === HttpStatus.NOT_FOUND) 
    //     return response.status(status).render('views/404');
    // if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
    //     if (process.env.NODE_ENV === 'production') {
    //       console.error(error.stack);
    //       return response.status(status).render('views/500');
    //     }
    //     else {
    //       let message = error.stack;
    //       return response.status(status).send(message); 
    //     } 
    // }

    // console.error(exception.message);
    // let code: number = 40000;
    // if (status === 401) {
    //   code = 40100
    // }
    response
      .status(200)
      .json({
        code: status,
        message: exception.message,
        path: request.url,
      });
  }
  code: number;
  message: string;
  data: any[];
  error: any;
}