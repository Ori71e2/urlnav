import { Controller, UseGuards, Get, Query, Request, Response } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WebsiteService } from './website.service';
import { CResponse } from 'src/shared/common/dto/response.dto';
import {default as config} from 'src/config';
import { RolesGuard } from 'src/shared/common/guards/role.guard';
import { Role } from 'src/shared/common/decorators/role.decorator';
import { ROLE, RES } from 'src/shared/common/constrant';
import { ConfigService } from '@nestjs/config';

@Controller('website')
export class WebsiteController {
  constructor(
    private readonly websiteService: WebsiteService,
    private readonly configService: ConfigService
  ) {}

  @Get('list')
  async paginateQuery(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 15,
    @Query('sorttype') sorttype: string = 'DESC',
    @Query('like') like: string = '',
    @Request() req)
  {
    try {
      console.log(req.cookies)
      limit = limit > 500 ? 500 : limit;
      let list = await this.websiteService.paginateQuery(
        { page,
          limit,
          route: this.configService.get('HOST').url + '/website/list'
        },
        {
          sorttype,
          like
        }
      );
      return new CResponse(RES.SUCCESS, list);
    } catch(error) {
      return new CResponse(RES.CERROR);
    }
  }
}
