import { Controller, Post, Get, Body, Request, Response, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Login } from './interfaces/login.interface';
import { CResponse } from 'src/shared/common/dto/response.dto';
import { IResponse } from 'src/shared/common/interfaces/response.interface';
import { CreateUserDto } from 'src/shared/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { ResetPasswordDto } from 'src/shared/dto/reset-password.dto';
import { InittranacService } from '../../transaction/inittranac.service';
import { EmailService } from '../email/email.service';
import { RES } from 'src/shared/common/constrant';
import { JwtAuthGuard } from 'src/shared/common/guards/jwtauth.guard'
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly inittranacService: InittranacService,
    private readonly emailService: EmailService
  ) {}
  @UseGuards(JwtAuthGuard)
  @Get('email/isLogin')
  public async isLogin(@Request() req: any): Promise<IResponse> {
    try {
      const vip_expiretime = req.user.vip_expiretime
      const vip = vip_expiretime >= new Date().getTime() ? 1 : 0
      const userInfo = {
        email: req.user.email,
        role: req.user.role,
        vip_expiretime: vip_expiretime,
        vip: vip
      }
      return new CResponse(RES.SUCCESS, userInfo);
    } catch(e) {
      return new CResponse(RES.REDIRECT_AUTH_LOGIN, e);
    }
  }

  @Post('email/login')
  public async login(@Body() login: Login, @Response() res): Promise<IResponse> {
    try {
      let { token, user } = await this.authService.validateLogin(login.email, login.password);
      res.cookie('authorization', token, { expires: new Date(Date.now() + 1000*60*60*24*10), secure: false, httpOnly: true });
      // delete user.password;
      // delete user.id;
      const vip_expiretime = user.vip_expiretime
      const vip = vip_expiretime >= new Date().getTime() ? 1 : 0
      const userInfo = {
        email: user.email,
        role: user.role,
        vip_expiretime: vip_expiretime,
        vip: vip
      }
      return res.send(new CResponse(RES.SUCCESS, userInfo));
    } catch(e) {
      return res.send(new CResponse(RES.CERROR_AUTH_LOGIN, e));
    }
  }
  @Post('email/logout')
  public async logout(@Response() res): Promise<IResponse> {
    try {
      res.cookie('authorization', '', { maxAge: 0 });
      res.cookie('opcode', '', { maxAge: 0 });
      return res.send(new CResponse(RES.SUCCESS, ''));
    } catch(e) {
      return res.send(new CResponse(RES.CERROR_AUTH_LOGOUT, e));
    }
  }
  @Post('email/register')
  async register(@Body() createUserDto: CreateUserDto): Promise<IResponse> {
    try {
      await this.emailService.verifyEmailToekn({ email: createUserDto.email, emailToken: createUserDto.token });
      await this.inittranacService.init(createUserDto);
      await this.emailService.clearEmailToekn(createUserDto.email);
      return new CResponse(RES.SUCCESS);
    } catch(e){
      return new CResponse(RES.CERROR_AUTH_REGISTER, e);
    }
  }

  @Post('email/resetPassword')
  public async resetPassord(@Body() resetPassword: ResetPasswordDto): Promise<IResponse> {
    try {
      await this.emailService.verifyEmailToekn({ email: resetPassword.email, emailToken: resetPassword.token });
      await this.userService.setPassword(resetPassword.email, resetPassword.password);
      await this.emailService.clearEmailToekn(resetPassword.email);
      return new CResponse(RES.SUCCESS);
    } catch(e){
      return new CResponse(RES.CERROR_AUTH_PASSWORD, e);
    }
  }
}
