import { Controller, Get, Param, UseGuards, Post, Request, Body, Query } from '@nestjs/common';
import { EmailService } from '../../email/email.service';
import { IResponse } from 'src/shared/common/interfaces/response.interface';
import { CResponse } from 'src/shared/common/dto/response.dto';
import { RES, ROLE } from 'src/shared/common/constrant';
import { JwtAuthGuard } from 'src/shared/common/guards/jwtauth.guard';
import { RolesGuard } from 'src/shared/common/guards/role.guard';
import { Role } from 'src/shared/common/decorators/role.decorator';
import { EmailTranDto } from 'src/shared/dto/email-tran.dto';
import { CParseIntPipe } from 'src/shared/common/pipes/cparse-int.pipe';

import { EmailtranacService } from 'src/transaction/emailtranac.service ';
import { ConfigService } from '@nestjs/config';
import { OpcodeGuard } from 'src/shared/common/guards/opcode.guard';

@UseGuards(JwtAuthGuard, RolesGuard, OpcodeGuard)
@Role(ROLE.SUPER_ADMIN)
@Controller('admin/emailTran')
export class AdminEmailTranController {
  constructor(
    private readonly emailService: EmailService,
    private readonly emailtranService: EmailtranacService,
    private readonly configService: ConfigService
  ) {}
  @Get('test')
  public async test(@Query('id', CParseIntPipe) id, @Query('testEmailReceiver') testEmailReceiver): Promise<IResponse> {
    try {
      const result = await this.emailService.test(id, testEmailReceiver)
      if (result) {
        return new CResponse(RES.SUCCESS);
      } else {
        return new CResponse(RES.CERROR_EMAIL_SENT);
      }
    } catch(e) {
      return new CResponse(RES.CERROR_EMAIL_SENT, e);
    }
  }
  @Post('update')
  async update(@Request() req: any, @Body() body: EmailTranDto) {
    try {
      let emailTran: EmailTranDto = { id: body.id, name: body.name, host: body.host, port: body.port, user: body.user, pass: body.pass };
      await this.emailService.updateEmailTran(emailTran);
      return new CResponse(RES.SUCCESS);
    } catch (e) {
      return new CResponse(RES.CERROR, e);
    }
  }
  @Post('create')
  async create(@Request() req: any, @Body() body: EmailTranDto) {
    try {
      let emailTran: EmailTranDto = { name: body.name, host: body.host, port: body.port, user: body.user, pass: body.pass };
      emailTran = await this.emailService.createEmailTran(emailTran);
      return new CResponse(RES.SUCCESS, emailTran);
    } catch (e) {
      return new CResponse(RES.CERROR_EMAIL_TRAN_CREATE, e);
    }
  }
  @Post('delete')
  async delete(@Request() req: any, @Body() body: { id: number }) {
    try {
      await this.emailService.deleteEmailTran(body.id);
      return new CResponse(RES.SUCCESS);
    } catch(error) {
      return new CResponse(RES.CERROR_EMAIL_TRAN_ACTIVE);
    }
  }
  @Post('active')
  async active(@Request() req: any, @Body() body: { id: number }) {
    try {
      const emailTran: EmailTranDto = await this.emailtranService.setActived(body.id);
      if (emailTran && emailTran.active) {
        return new CResponse(RES.SUCCESS);
      } else {
        return new CResponse(RES.CERROR_EMAIL_TRAN_ACTIVE);
      }
    } catch(error) {
      return new CResponse(RES.CERROR_EMAIL_TRAN_ACTIVE);
    }
  }
  @Post('inactive')
  async setInactive(@Request() req: any, @Body() body: { id: number }) {
    try { 
      await this.emailService.setInactived(body.id);
      return new CResponse(RES.SUCCESS);
    } catch(error) {
      return new CResponse(RES.CERROR_EMAIL_TRAN_INACTIVE);
    }
  }
  @Get('list')
  async paginateQuery(
    @Query('page', CParseIntPipe) page: number = 1,
    @Query('limit', CParseIntPipe) limit: number = 15,
    @Query('email') email: string,
    @Query('sorttype') sorttype: 'DESC' | 'ASC')
  {
    try {
      limit = limit > 500 ? 500 : limit;
      let list = await this.emailService.eｍailTranPaginateQuery(
        { page, limit, route: this.configService.get('HOST').url + '/admin/emailTran/list' },
        { sorttype }
      );
      return new CResponse(RES.SUCCESS, list);
    } catch(error) {
      return new CResponse(RES.CERROR_EMAIL_TRAN_SEARCH);
    }
  }
}
