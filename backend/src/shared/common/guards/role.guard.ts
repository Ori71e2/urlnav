import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ROLE } from '../constrant';
import { User } from 'src/shared/entity'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    
    try {
      let role = this.reflector.get<number>('role', context.getHandler());
      let roleClass = this.reflector.get<number>('role', context.getClass());
      role = role ? role : ROLE.HUMAN;
      roleClass = roleClass ? roleClass : ROLE.HUMAN;
      const roleRequired = role > roleClass ? role : roleClass;
      const req = context.switchToHttp().getRequest();
      const user: User = req.user;
      console.log(roleRequired)
      let hasPermission: boolean = false;
      if (typeof user !== undefined) {
        if (roleRequired >= ROLE.DEVELOPER && user.role >= roleRequired) {
          hasPermission = true;
        }
        if (roleRequired === ROLE.VIP) {
          if (user.vip_expiretime > new Date().getTime()) {
            hasPermission = true;
          }
        }
        if (roleRequired < ROLE.VIP) {
          hasPermission = true;
        }
      }
      return hasPermission;
    } catch(error) {
      return false
    }
  }
}
