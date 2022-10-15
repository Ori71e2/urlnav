import { Controller, Get, Request, CacheStore, CACHE_MANAGER, Inject } from '@nestjs/common';
import { UrlService } from '../url.service';
import { Url } from 'src/shared/entity';
import { IResponse } from 'src/shared/common/interfaces/response.interface';
import { CResponse } from 'src/shared/common/dto/response.dto';
import { ROLE, RES } from 'src/shared/common/constrant';
@Controller('url/tmp')
export class UrltmpController {
  constructor(
    private readonly urlService: UrlService,
    @Inject(CACHE_MANAGER) readonly cacheManager: CacheStore
  ) {}
  // 使用了 ResponseSuccess 别再使用 @Response 装饰器，否则无法返回， 错误提示 curl: (52) Empty reply from server
  @Get('published')
  async getUrltmpPublished(@Request() req: Request | any): Promise<IResponse> {
    try {
      let url: Url = await this.cacheManager.get('urltmppublished');
      if(!url) {
        url = await this.urlService.getUrltmpPublished();
        await this.cacheManager.set('urltmppublished', url);
      }
      delete url.id;
      delete url.createtime;
      delete url.publish;
      delete url.publishtime;
      delete url.user_id;
      return new CResponse(RES.SUCCESS, url);
    } catch (e) {
      return new CResponse(RES.CERROR_URL_TMP_NOT_FOUND, e);
    } 
  }
}
