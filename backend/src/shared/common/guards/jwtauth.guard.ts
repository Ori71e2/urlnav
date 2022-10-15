import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ROLE, RES } from 'src/shared/common/constrant';
import { CResponse } from '../dto/response.dto';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      // throw err || new UnauthorizedException();
      throw new HttpException(RES.REDIRECT_AUTH_LOGIN.msg, RES.REDIRECT_AUTH_LOGIN.code)
      // throw new CResponse(RES.REDIRECT_AUTH_LOGIN);
    }
    return user;
  }
}
