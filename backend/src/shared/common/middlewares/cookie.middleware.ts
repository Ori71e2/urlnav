import { Injectable, NestMiddleware} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entity';
// 对请求进行处理，将cookie中authorization值赋值到req.header中的authorization字段
@Injectable()
export class CookieMiddleware implements NestMiddleware {
  use(req: Request | any, res: Response, next: Function) {
    try {
      // console.log('Cookie Middleware');
      // console.log(req.cookies);
      // if (req.cookies && req.cookies.authorization) {
        // console.log(req.cookies.authorization)
        // req.headers['authorization'] = 'Bearer ' + req.cookies.authorization;
        // console.log(req.headers);
      // }
    } catch (error) {}
    next();
  };
}