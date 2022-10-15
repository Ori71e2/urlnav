import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Website } from 'src/shared/entity';
import {paginate, Pagination, IPaginationOptions} from 'src/lib/nestjs-typeorm-paginate';

import stringRandom = require('string-random');

@Injectable()
export class WebsiteService {
  constructor(
    @InjectRepository(Website) private readonly websiteRepository: Repository<Website>
    ) {}
  
  async generate(): Promise<boolean> {
    for (let i=0; i<10000; i++) {
      let website = this.websiteRepository.create();
      website.url = 'www.' + stringRandom(10, { numbers: true, letters: true }) + '.com';
      // website.describe = stringRandom(4, { numbers: false, letters: true });
      website.rank = 0;
      website.recommend = false;
      this.websiteRepository.save(website);
    }
    return true
  }

  async paginateQuery(options: IPaginationOptions, { sorttype, like }): Promise<Pagination<Website>> {
    if (['DESC', 'ASC'].indexOf(sorttype) === -1) {
      sorttype = 'DESC'
    }
    const queryBuilder = this.websiteRepository.createQueryBuilder('website')

    if (like !== '') { queryBuilder.andWhere('website.url LIKE :like', { like: '%'+like+'%' }) }

    queryBuilder.orderBy('website.rank', sorttype)
    return await paginate<Website>(queryBuilder, options);
  }
}
