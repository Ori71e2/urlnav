import { Controller, Get, Query, Post, Body, Request, Redirect, UseGuards } from '@nestjs/common';
import { AdminService } from '../admin.service';
import { PayService } from '../../../pay/pay.service';
import { UserService } from '../../user/user.service';
import { InittranacService } from '../../../transaction/inittranac.service';
import { IResponse } from 'src/shared/common/interfaces/response.interface';

import {default as config} from '../../../config';
import { UrlService } from '../../url/url.service';
import { AuthService } from '../../auth/auth.service';
import { CreateUserDto } from 'src/shared/dto/create-user.dto';
import { CardService } from '../../card/card.service';
import { CardDto } from 'src/shared/dto/card.dto';

@Controller('admin')
// @UseGuards(JwtAuthGuard)
// @UseGuards(RolesGuard)
// @Roles(role.DEVELOPER)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly payService: PayService,
    private readonly userService: UserService,
    private readonly urlService: UrlService,
    private readonly authService: AuthService,
    private readonly initService: InittranacService,
    private readonly cardService: CardService
  ) {}

  // @Get('porder/list')
  // async porderPaginateQuery(
  //   @Query('page') page: number = 1,
  //   @Query('limit') limit: number = 15,
  //   @Query('starttime') starttime: number,
  //   @Query('endtime') endtime: number,
  //   @Query('id') id: number,
  //   @Query('order_no') order_no: string,
  //   @Query('payjs_order_id') payjs_order_id: string,
  //   @Query('user_id') user_id: string,
  //   @Query('success') success: boolean,
  //   @Query('sorttype') sorttype: 'DESC' | 'ASC')
  // {
  //   try {
  //     limit = limit > 500 ? 500 : limit;
  //     let list = await this.payService.paginateQuery(
  //       { page, limit, route: config.host.url + '/admin/porder/list' },
  //       { starttime, endtime, id, order_no, payjs_order_id, user_id, success, sorttype }
  //     );
  //     return new ResponseSuccess("PORDER.GET_SUCCESS", list);
  //   } catch(error) {
  //     return new ResponseError(50000, "PORDER.GET_ERROR", error);
  //   }
  // }

  // @Get('email/list')
  // async emailPaginateQuery(
  //   @Query('page') page: number = 1,
  //   @Query('limit') limit: number = 15,
  //   @Query('sorttype') sorttype: 'DESC' | 'ASC',
  //   @Query('starttime') starttime: number,
  //   @Query('endtime') endtime: number,
  //   @Query('id') id: number,
  //   @Query('email') email: string,
  //   @Query('emailToken') emailToken: string,
  //   @Query('trytimes') trytimes: number)
  // {
  //   try {
  //     limit = limit > 500 ? 500 : limit;
  //     let data = await this.authService.paginateQuery(
  //       { page, limit, route: config.host.url + '/admin/email/list' },
  //       { starttime, endtime, id, email, emailToken, trytimes, sorttype }
  //     );
  //     return new ResponseSuccess("USER.GET_SUCCESS", data);
  //   } catch(error) {
  //     return new ResponseError(50000, "USER.GET_ERROR", error);
  //   }
  // }
}