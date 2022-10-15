import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { JWTService } from '../../../module/auth/jwt.service';
import { UserService } from '../../../module/user/user.service';
export interface Response<T> {
  data: T;
}

@Injectable()
export class CookieInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T> | any> {
    const http = context.switchToHttp();
    const res = http.getResponse();
    const req = http.getRequest();
    // res.cookie('test', 'test');
    try {
      if (req && req.user && req.user.email && req.user.role && req.cookies.authorization) {
        const decodedToken: any = JWTService.decodeToken(req.cookies.authorization)
        const nowtime = new Date().getTime()
        // console.log(decodedToken)
        // 在cookie authorization 失效前一天进行更新
        if (decodedToken.exp * 1000 < nowtime - 24 * 60 * 60 * 1000) {
          let token = JWTService.createToken(req.user.email, req.user.role);
          res.cookie('authorization', token, { expires: new Date(Date.now() + decodedToken.exp), secure: false, httpOnly: true });
        }
        // console.log(decodedToken);
      }
      // console.log(req.originalUrl)
    } catch(e) {
    }
    return next.handle().pipe(map(data => data));
  }
}