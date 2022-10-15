import { Controller, Get, Query, Post, Body, Request, Redirect, UseGuards } from '@nestjs/common';
import { CResponse } from 'src/shared/common/dto/response.dto';
import { CParseIntPipe } from 'src/shared/common/pipes/cparse-int.pipe';
import { RolesGuard } from 'src/shared/common/guards/role.guard';
import { Role } from 'src/shared/common/decorators/role.decorator';
import { ROLE } from 'src/shared/common/constrant';
import { EmailService } from 'src/module/email/email.service';
import { JwtAuthGuard } from 'src/shared/common/guards/jwtauth.guard';
import { RES } from 'src/shared/common/constrant';
import { ConfigService } from '@nestjs/config';
import { OpcodeGuard } from 'src/shared/common/guards/opcode.guard';
@UseGuards(JwtAuthGuard, RolesGuard, OpcodeGuard)
@Role(ROLE.ADMIN)
@Controller('admin/emailToken')
export class AdminEmailTokenController {
  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  @Get('list')
  async paginateQuery(
    @Query('page', CParseIntPipe) page: number = 1,
    @Query('limit', CParseIntPipe) limit: number = 15,
    @Query('email') email: string,
    @Query('sorttype') sorttype: 'DESC' | 'ASC')
  {
    try {
      limit = limit > 500 ? 500 : limit;
      let list = await this.emailService.emailTokenPaginateQuery(
        { page, limit, route: this.configService.get('HOST').url + '/admin/emailToken/list' },
        { email, sorttype }
      );
      return new CResponse(RES.SUCCESS, list);
    } catch(error) {
      return new CResponse(RES.CERROR_EMAIL_SEARCH);
    }
  }
}