import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { User } from 'src/shared/entity'
import { Md5 } from 'ts-md5';
@Injectable()
export class OpcodeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const user: User = req.user;
      const cookies: any = req.cookies
      let hasPermission: boolean = false;
      if (typeof user !== undefined && cookies.opcode !== undefined) {
        if ( Md5.hashStr(user.opcode + user.id) === cookies.opcode) {
          hasPermission = true
        }
      }
      console.log(cookies)
      return hasPermission;
    } catch(error) {
      return false
    }
  }
}
