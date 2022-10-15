import { Controller, Post, Response, Request, Body, HttpStatus, UseInterceptors, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { LoggingInterceptor } from 'src/shared/common/interceptors/logging.interceptor';
import { TransformInterceptor } from 'src/shared/common/interceptors/transform.interceptor';
import { CResponse } from 'src/shared/common/dto/response.dto';
import { RolesGuard } from 'src/shared/common/guards/role.guard';
import { Role } from 'src/shared/common/decorators/role.decorator';
import { ROLE } from 'src/shared/common/constrant';
import { ResetPasswordDto } from 'src/shared/dto/reset-password.dto';
import { IResponse } from 'src/shared/common/interfaces/response.interface';
import { RES } from 'src/shared/common/constrant';
import { JwtAuthGuard } from 'src/shared/common/guards/jwtauth.guard';
import { AuthService } from 'src/module/auth/auth.service';
import { Md5 } from 'ts-md5';
@UseGuards(JwtAuthGuard, RolesGuard)
@Role(ROLE.REGISTER)
@Controller('user')
@UseInterceptors(LoggingInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}
  @Post('profile/update')
  async updateProfile(@Request() req: any, @Body() body: any) {
    try {
      let id = req.user.id;
      let name = body.name;
      let success = await this.userService.updateProfile({ id, name });
      if (success) {
        return new CResponse(RES.SUCCESS);
      } else {
        return new CResponse(RES.CERROR_USER_UPDATE);
      }
    } catch(e) {
      return new CResponse(RES.CERROR_USER_UPDATE, e);
    }
  }
  @Post('opcode/set')
  async setOpcode(@Request() req: any, @Body() body: any) {
    try {
      let id = req.user.id;
      const { password, opcode } = body;
      await this.userService.setOpcode(id, password, opcode);
      return new CResponse(RES.SUCCESS);
    } catch(e) {
      return new CResponse(RES.CERROR_USER_OPCODE_UPDATE, e);
    }
  }
  @Role(ROLE.VIP)
  @Post('opcode/verify')
  async verifyOpcode(@Request() req: any, @Body() body: any, @Response() res: any) {
    try {
      let id = req.user.id;
      const { opcode } = body;
      if (opcode === undefined) {
        // return new CResponse(RES.CERROR_AUTH_OPCODE);
        return res.send(new CResponse(RES.CERROR_AUTH_OPCODE, ''));
      }
      await this.userService.verifyOpcode(id, opcode);
      res.cookie('opcode', Md5.hashStr(opcode + id), { expires: new Date(Date.now() + 1000*60*60*24*10), secure: false, httpOnly: true });
      return res.send(new CResponse(RES.SUCCESS, ''));
    } catch(e) {
      return res.send(new CResponse(RES.CERROR_AUTH_OPCODE, e));
    }
  }
  @Role(ROLE.VIP)
  @Post('opcode/clear')
  async clearOpcode(@Request() req: any, @Body() body: any, @Response() res: any) {
    try {
      res.cookie('opcode', '', { maxAge: 0 });
      return res.send(new CResponse(RES.SUCCESS, ''));
    } catch(e) {
      return res.send(new CResponse(RES.CERROR_AUTH_OPCODE, e));
    }
  }
  @Post('setNewPassword')
  public async setNewPassord(@Request() req: any, @Body() resetPassword: ResetPasswordDto): Promise<IResponse> {
    try {
      const email = req.user.email;
      const oldPassword = resetPassword.oldPassword;
      const newPassword = resetPassword.newPassword;
      console.log(resetPassword);
      await this.authService.validatePassword(email, oldPassword);
      await this.userService.setPassword(email, newPassword);
      return new CResponse(RES.SUCCESS);
    } catch(e){
      return new CResponse(RES. CERROR_USER_PASSWORD_UPDATE, e);
    }
  }
}
