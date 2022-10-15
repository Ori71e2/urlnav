import {
  PipeTransform,
  // Pipe,
  ArgumentMetadata,
} from '@nestjs/common';

import { CResponse } from '../dto/response.dto';
import { RES, URLSIZE } from '../constrant';
import { UrlDto } from 'src/shared/dto/url.dto';

// @Pipe()
export class CUrlSizePipe implements PipeTransform<any> {
  async transform(url: UrlDto, metadata: ArgumentMetadata) {
    if (url !== undefined) {
      // const listSize = new Blob([url.list]).size
      // const tagSize = new Blob([url.tag]).size
      // const groupTransferSize = new Blob([url.group_transfer]).size
      // const siteTransferSize = new Blob([url.site_transfer]).size
      const listSize = Buffer.byteLength(url.list, 'utf-8')
      const tagSize = Buffer.byteLength(url.tag, 'utf-8')
      const groupTransferSize = Buffer.byteLength(url.group_transfer, 'utf-8')
      const siteTransferSize = Buffer.byteLength(url.site_transfer, 'utf-8')
      const maxListSize = URLSIZE.maxListSize
      const maxTagSize = URLSIZE.maxTagSize
      const maxGroupTransferSize = URLSIZE.maxGroupTransferSize
      const maxSiteTransferSize = URLSIZE.maxSiteTransferSize
      if (listSize > maxListSize || tagSize > maxTagSize || groupTransferSize > maxGroupTransferSize || siteTransferSize > maxSiteTransferSize ) {
        throw new CResponse(RES.CERROR_PARAM_SIZE);
      }

      return url;
    }
  }
}
