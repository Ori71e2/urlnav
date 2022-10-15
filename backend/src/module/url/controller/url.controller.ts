import { Controller, Post, Get, Request, Body,  UseGuards, Query, CacheStore, CACHE_MANAGER, Inject } from '@nestjs/common';
import { UrlService } from '../url.service';
import { UserService } from 'src/module/user/user.service';
import { UrlDto } from 'src/shared/dto/url.dto';
import { Url } from 'src/shared/entity';
import { IResponse } from 'src/shared/common/interfaces/response.interface';
import { CResponse } from 'src/shared/common/dto/response.dto';
import { RolesGuard } from 'src/shared/common/guards/role.guard';
import { Role } from 'src/shared/common/decorators/role.decorator';
import { ROLE, RES } from 'src/shared/common/constrant';
import { JwtAuthGuard } from 'src/shared/common/guards/jwtauth.guard';
import { CUrlSizePipe } from 'src/shared/common/pipes/curl-size.pipe';
import { OpcodeGuard } from 'src/shared/common/guards/opcode.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('url')
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) readonly cacheManager: CacheStore
  ) {

  }
  // 使用了 ResponseSuccess 别再使用 @Response 装饰器，否则无法返回， 错误提示 curl: (52) Empty reply from server

  @Role(ROLE.REGISTER)
  @Get('one')
  async getOneByUserId(@Request() req: Request | any, @Query('opcode') opcode: string): Promise<IResponse> {
    try {
      let id = req.user.id
      let url : Url
      url = await this.urlService.getOneByUserId(id);

      // delete url.id
      delete url.createtime
      delete url.publish
      delete url.publishtime
      delete url.user_id

      if (opcode !== undefined && opcode !== '') {
        await this.userService.verifyOpcode(id, opcode);
        return new CResponse(RES.SUCCESS, url);
      } else {
        url.list = this.urlService.removeListLockedFiled(url.list)
        return new CResponse(RES.SUCCESS, url);
      }

    } catch (e) {
      return new CResponse(RES.CERROR_URL_NOT_FOUND, e);
    } 
  }
  @UseGuards(OpcodeGuard)
  @Role(ROLE.VIP)
  @Post('update')
  async update(@Request() req: any, @Body(CUrlSizePipe) body: any) {
    try {
      let user_id = req.user.id
      let url: UrlDto = { id: body.id, user_id, list: body.list, tag: body.tag, group_transfer: body.group_transfer, site_transfer: body.site_transfer, search_site: body.search_site };
      let result: Url = await this.urlService.update(url);
      return new CResponse(RES.SUCCESS, result);
    } catch (e) {
      return new CResponse(RES.CERROR, e);
    }
  }
  @UseGuards(OpcodeGuard)
  @Role(ROLE.VIP)
  @Get('updatetime')
  async getUpdateTimeByUserId(@Request() req: Request | any): Promise<IResponse> {
    try {
      let id = req.user.id
      let url: Url = await this.urlService.getOneByUserId(id);
      const updatetime: number = url.updatetime
      return new CResponse(RES.SUCCESS, { 'updatetime': updatetime });
    } catch (e) {
      return new CResponse(RES.CERROR, e);
    } 
  }
}
