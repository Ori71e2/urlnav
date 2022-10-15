import { Controller, Get, Query, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { CResponse } from 'src/shared/common/dto/response.dto';
import { CParseIntPipe } from 'src/shared/common/pipes/cparse-int.pipe';
import { CParseBooleanPipe } from 'src/shared/common/pipes/cparse-boolean.pipe';
import { RolesGuard } from 'src/shared/common/guards/role.guard';
import { Role } from 'src/shared/common/decorators/role.decorator';
import { ROLE } from 'src/shared/common/constrant';
import { User } from 'src/shared/entity';
import { JwtAuthGuard } from 'src/shared/common/guards/jwtauth.guard';
import { RES } from 'src/shared/common/constrant';
import { ConfigService } from '@nestjs/config';
import { OpcodeGuard } from 'src/shared/common/guards/opcode.guard';
@UseGuards(JwtAuthGuard, RolesGuard, OpcodeGuard)
@Role(ROLE.ADMIN)
@Controller('admin/user')
export class AdminUserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {}

  @Get('list')
  async userPaginateQuery(
    @Query('page', CParseIntPipe) page: number = 1,
    @Query('limit', CParseIntPipe) limit: number = 15,
    @Query('starttime', CParseIntPipe) starttime: number,
    @Query('endtime', CParseIntPipe) endtime: number,
    @Query('id', CParseIntPipe) id: number,
    @Query('name') name: string,
    @Query('email') email: string,
    @Query('vip', CParseBooleanPipe) vip: boolean,
    @Query('role') role: string,
    @Query('vip_expiretime', CParseIntPipe) vip_expiretime: number,
    @Query('active', CParseBooleanPipe) active: boolean,
    @Query('sorttype') sorttype: 'DESC' | 'ASC')
  {
    try {
      limit = limit > 500 ? 500 : limit;
      let list = await this.userService.paginateQuery(
        { page, limit, route: this.configService.get('HOST').url + '/admin/user/list' },
        { starttime, endtime, id, name, email, vip, role, active, sorttype }
      );
      return new CResponse(RES.SUCCESS, list);
    } catch(error) {
      return new CResponse(RES.CERROR_USER_SEARCCH);
    }
  }

  @Post('update')
  async userUpdate(@Body() user: User)
  {
    try {
      let { id, role, vip_expiretime, active } = user;
      let res = await this.userService.updateUser(
        {
          id,
          role,
          vip_expiretime,
          active,
        }
      );
      return new CResponse(RES.SUCCESS);
    } catch(error) {
      return new CResponse(RES.CERROR_USER_UPDATE);
    }
  }
  @Get('detail')
  async userDetail(@Query() id: number)
  {
    try {
      const user = await this.userService.findById(id);
      delete user.password
      return new CResponse(RES.SUCCESS, user);
    } catch(error) {
      return new CResponse(RES.CERROR_USER_DETAIL);
    }
  }
}