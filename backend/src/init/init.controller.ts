
import { Controller, Post, Get, Body, Request, Response, UseGuards } from '@nestjs/common';

import {  CResponse } from '../shared/common/dto/response.dto';
import { IResponse } from '../shared/common/interfaces/response.interface';
import { CreateUserDto } from '../shared/dto/create-user.dto';
import { UserService } from '../module/user/user.service';
import { ResetPasswordDto } from '../shared/dto/reset-password.dto';
import { InittranacService } from '../transaction/inittranac.service';
import { EmailService } from '../module/email/email.service';
import { RES } from 'src/shared/common/constrant';
import { JwtAuthGuard } from 'src/shared/common/guards/jwtauth.guard'
import { InitService } from './init.service';
@Controller('init')

export class InitController {
  constructor(
    private readonly inittranacService: InittranacService,
    private readonly initService: InitService
  ) {}

  @Post('setRoot')
  async setRoot(@Body() createUserDto: CreateUserDto): Promise<IResponse> {
    try {
      await this.inittranacService.initRoot(createUserDto);
      return new CResponse(RES.SUCCESS);
    } catch(e){
      return new CResponse(RES.CERROR_INIT_ROOT, e);
    }
  }
  @Get('isRootSet')
  async isRootSet(): Promise<IResponse> {
    try {
      await this.initService.isRootSet();
      return new CResponse(RES.SUCCESS);
    } catch(e){
      return new CResponse(RES.CERROR_ROOT_EXIST, e);
    }
  }
}
