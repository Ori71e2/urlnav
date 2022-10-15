import { Controller, Post, Body, Request, Get, UseGuards, Query, Param } from '@nestjs/common';
import { PayService } from './pay.service';
import { CResponse } from '../shared/common/dto/response.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../shared/common/guards/role.guard';
import { Role } from '../shared/common/decorators/role.decorator';
import { ROLE } from '../shared/common/constrant';
import {default as config} from '../config';
import { Porder } from 'src/shared/entity';
import { JwtAuthGuard } from 'src/shared/common/guards/jwtauth.guard';
import { RES } from 'src/shared/common/constrant';
@Controller('pay')

export class PayController {
  constructor(
    private readonly payService: PayService
  ) {}
  @Get('qrcode')
  async geneteQrcode(@Request() req) {
    try {
      // let user = req.user
      // let data = await this.payService.geneteQrcode(user.id);
      let data = await this.payService.geneteQrcode(1);

      if (data) {
        return new CResponse(RES.SUCCESS, data);
      } else {
        return new CResponse(RES.CERROR);
      }
      
    } catch(error) {
      return new CResponse(RES.CERROR);
    }
  }

  @Post('notify')
  async notify(@Body() req) {
    try{
      let data = await this.payService.notify(req);
      if (data) {
        return new CResponse(RES.SUCCESS, data);
      } else {
        return new CResponse(RES.CERROR);
      }
    } catch(error) {
      return new CResponse(RES.CERROR);
    }
  }
  @Get('list/all/')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Role(ROLE.DEVELOPER)
  async paginate(@Query('page') page: number = 1, @Query('limit') limit: number = 15) {
    try {
      limit = limit > 500 ? 500 : limit;
      let list = await this.payService.paginate({
        page,
        limit,
        route: config.host.url + '/website/list',
      });
      return new CResponse(RES.SUCCESS, list);
    } catch(error) {
      return new CResponse(RES.CERROR);
    }
  }
  @Get('list/user/:order_no')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Role(ROLE.DEVELOPER)
  async getUserOrderByOrderNo(@Param('order_no') order_no: string) {
    try {
      let data: Porder = await this.payService.getOrderByOrderNo(order_no + '');
      return new CResponse(RES.SUCCESS, data);
    } catch(error) {
      return new CResponse(RES.CERROR);
    }
  }

  // @UseGuards(JwtAuthGuard)
 
  @Get('user/list/')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Role(ROLE.REGISTER)
  async getUserOrder(@Request() req) {
    try {
      let user_id: number = req.user.id;
      let data: Array<Porder> = await this.payService.getOrderByUserId({ user_id });
      let list: Array<string> = data.map((value) => { return value.order_no });
      return new CResponse(RES.SUCCESS, list);
    } catch(error) {
      return new CResponse(RES.CERROR);
    }
  }
}
