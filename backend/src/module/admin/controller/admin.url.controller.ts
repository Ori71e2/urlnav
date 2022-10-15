import { Controller, Get, Query, Post, Body, UseGuards, Delete, CacheStore, CACHE_MANAGER, Inject } from '@nestjs/common';
import { CResponse } from 'src/shared/common/dto/response.dto';
import { Url } from 'src/shared/entity';
import { UrlService } from 'src/module/url/url.service';
import { CParseIntPipe } from 'src/shared/common/pipes/cparse-int.pipe';
import { UrlDto } from 'src/shared/dto/url.dto';
import { CParseBooleanPipe } from 'src/shared/common/pipes/cparse-boolean.pipe';
import { UrltranService } from 'src/transaction/urltran.service';
import { RolesGuard } from 'src/shared/common/guards/role.guard';
import { Role } from 'src/shared/common/decorators/role.decorator';
import { ROLE } from 'src/shared/common/constrant';
import { JwtAuthGuard } from 'src/shared/common/guards/jwtauth.guard';
import { RES } from 'src/shared/common/constrant';
import { ConfigService } from '@nestjs/config';
import { OpcodeGuard } from 'src/shared/common/guards/opcode.guard';
@UseGuards(JwtAuthGuard, RolesGuard, OpcodeGuard)
@Role(ROLE.ADMIN)
@Controller('admin/url')
export class AdminUrlController {
  constructor(
    private readonly urlService: UrlService,
    private readonly urltranacService: UrltranService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) readonly cacheManager: CacheStore,
  ) {}

  @Get('list')
  async urltmpPaginateQuery(
    @Query('page', CParseIntPipe) page: number = 1,
    @Query('limit', CParseIntPipe) limit: number = 15,
    @Query('sorttype') sorttype: 'DESC' | 'ASC',
    @Query('starttime', CParseIntPipe) starttime: number,
    @Query('endtime', CParseIntPipe) endtime: number,
    @Query('tmp', CParseBooleanPipe) tmp: boolean)
  {
    try {
      limit = limit > 500 ? 500 : limit;
      let data = await this.urlService.paginateQuery(
        { page, limit, route: this.configService.get('HOST').url + '/admin/url/list' },
        { starttime, endtime, sorttype, tmp }
      );
      return new CResponse(RES.SUCCESS, data);
    } catch(error) {
      return new CResponse(RES.CERROR_URL_SEARCH);
    }
  }
  @Get('updatetime')
  async getUpdatetime(
    @Query('id', CParseIntPipe) id: number)
  {
    try {
      let url: Url = await this.urlService.getOneById(id);
      console.log(url);
      if (!url) {
        return new CResponse(RES.CERROR_URL_UPDATETIME);
      }
      const updatetime: number = url.updatetime
      return new CResponse(RES.SUCCESS, { 'updatetime': updatetime });
    } catch(error) {
      return new CResponse(RES.CERROR_URL_UPDATETIME);
    }
  }
  @Get('detail')
  async getUrldetail(
    @Query('id', CParseIntPipe) id: number)
  {
    try {
      let url: Url = await this.urlService.getOneById(id);
      if (!url) {
        return new CResponse(RES.CERROR_URL_DETAIL);
      }
      return new CResponse(RES.SUCCESS, url);
    } catch(error) {
      return new CResponse(RES.CERROR_URL_DETAIL);
    }
  }
  @Post('publish')
  async publish(@Body() body: { id: number })
  {
    try {
      // let urltmp = body.urltmp;
      // this.cacheManager.del('urltmppublished');
      // this.cacheManager.set('urltmppublished', new Date().getTime());
      // console.log(await this.cacheManager.get('urltmppublished'));
      let urlPublish: Url  = await this.urltranacService.setPublished(body.id);
      if (urlPublish && urlPublish.tmp) {
        await this.cacheManager.set('urltmppublished', urlPublish);
        return new CResponse(RES.SUCCESS);
      } else {
        return new CResponse(RES.CERROR_URL_PUBLISH);
      }
    } catch(error) {
      return new CResponse(RES.CERROR_URL_PUBLISH);
    }
  }
  @Get('create')
  async urlTmpCretae()
  {
    try {
      let urltmp = await this.urlService.createUrlTmp();
      if (urltmp) {
        return new CResponse(RES.SUCCESS, urltmp);
      } else {
        return new CResponse(RES.CERROR_URL_TMP_GENERATE);
      }
    } catch(error) {
      return new CResponse(RES.CERROR_URL_TMP_GENERATE);
    }
  }

  @Post('copy')
  async urlTmpCopy(@Body() body)
  {
    try {
      let id = body.id
      let urltmp = await this.urlService.copyUrlTmp(id);
      if (urltmp) {
        return new CResponse(RES.SUCCESS, urltmp);
      } else {
        return new CResponse(RES.CERROR_URL_TMP_COPY);
      }
    } catch(error) {
      return new CResponse(RES.CERROR_URL_TMP_COPY);
    }
  }

  @Post('urltmpupdate')
  async urlTmpUpdate(@Body() url: UrlDto)
  {
    try {
      url.user_id = -1
      let result = await this.urlService.update(url);
      return new CResponse(RES.SUCCESS, result);
    } catch (e) {
      return new CResponse(RES.CERROR_URL_TMP_UPDATE);
    }
  }
  @Post('update')
  async urlUpdate(@Body() url: UrlDto)
  {
    try {
      let result = await this.urlService.updateById(url);
      return new CResponse(RES.SUCCESS, result);
    } catch (e) {
      return new CResponse(RES.CERROR_URL_UPDATE);
    }
  }
  @Delete('delete')
  async urlTmpDelete(@Query('id') id: number)
  {
    try {
      let result = await this.urlService.deleteUrltmmp(id);
      return new CResponse(RES.SUCCESS, result);
    } catch (e) {
      return new CResponse(RES.CERROR_URL_TMP_DELETE);
    }
  }
}