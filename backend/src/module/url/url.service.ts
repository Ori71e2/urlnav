import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UrlDto } from 'src/shared/dto/url.dto';
import { Url } from 'src/shared/entity';
import { IPaginationOptions, Pagination, paginate } from 'src/lib/nestjs-typeorm-paginate';
import { UrlQueryDto } from 'src/shared/dto/url-query.dto';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url) private readonly urlRepository: Repository<Url>
  ) {}

  async getOne(user_id: number): Promise<Url > {
    let url: Url = await this.urlRepository.findOne({ user_id });
    if(!url.active) {
      let queryBuilder = this.urlRepository.createQueryBuilder('url')
      queryBuilder.andWhere('url.publish = :publish', { publish: true });
      queryBuilder.limit(1);
      url = await queryBuilder.getOne();
      if (!url) {
        let queryBuilder = this.urlRepository.createQueryBuilder('url')
        queryBuilder.andWhere('url.tmp = :tmp', { tmp: true });
        queryBuilder.orderBy('url.publishtime', 'ASC');
        queryBuilder.limit(1);
        url = await queryBuilder.getOne();
      }
    }
    if (!url) {
      throw new HttpException('not found url or urltmp in database', HttpStatus.NOT_FOUND);
    }
    url.list = this.transform(url.list)
    return url;
  }
  async getOneByUserId(user_id: number): Promise<Url > {
    let url: Url = await this.urlRepository.findOneOrFail({ user_id });
    url.list = this.transform(url.list)
    return url;
  }

  async getOneById(id: number): Promise<Url > {
    let url: Url = await this.urlRepository.findOneOrFail({ id: id });
    url.list = this.transform(url.list)
    return url;
  }
  async getUrltmpPublished(): Promise<Url> {
    let queryBuilder = this.urlRepository.createQueryBuilder('url')
    queryBuilder.andWhere('url.publish = :publish', { publish: true });
    queryBuilder.limit(1);
    let url = await queryBuilder.getOne();
    if (!url) {
      let queryBuilder = this.urlRepository.createQueryBuilder('url')
      queryBuilder.andWhere('url.tmp = :tmp', { tmp: true });
      queryBuilder.orderBy('url.publishtime', 'ASC');
      queryBuilder.limit(1);
      url = await queryBuilder.getOne();
    }
    url.list = this.transform(url.list);
    return url;
  }
  transform(str): string {
    // const arr = JSON.parse(str);
    // arr.forEach((item) => {
    //   if (item.lock === undefined) {
    //     item.lock = false;
    //   }
    // })
    // return JSON.stringify(arr);
    return str;
  }
  removeListLockedFiled(str): string {
    const arr = JSON.parse(str);
    const removedArr = arr.filter((item) => {
      if (item.lock === true) {
        return false
      } else {
        return true
      }
    })
    return JSON.stringify(removedArr)
  }
  // async insertOne(url: UrlDto): Promise<boolean> {
  //   const newUrl = this.urlRepository.create(url);
  //   return await this.urlRepository.insert(newUrl).then(() => { return true}).catch(() => { return false});
  // }

  // async deleteOne(url: UrlDto): Promise<boolean> {
  //   // const { id } = url;
  //   return await this.urlRepository.delete(url).then(() => { return true}).catch(() => { return false});
  // }

  async update(url: UrlDto): Promise<Url> {
    const { id, user_id } = url;
    let urldb = await this.urlRepository.findOneOrFail({ id, user_id });
    urldb.list = url.list;
    urldb.tag = url.tag;
    urldb.group_transfer = url.group_transfer;
    urldb.site_transfer = url.site_transfer;
    urldb.search_site = url.search_site;
    urldb.updatetime = new Date().getTime();
    return await this.urlRepository.save(urldb)
  }
  async updateById(url: UrlDto): Promise<Url> {
    const { id } = url;
    let urldb = await this.urlRepository.findOneOrFail({ id });
    urldb.list = url.list;
    urldb.tag = url.tag;
    urldb.group_transfer = url.group_transfer;
    urldb.site_transfer = url.site_transfer;
    urldb.search_site = url.search_site;
    urldb.updatetime = new Date().getTime();
    return await this.urlRepository.save(urldb)
  }

  async paginateQuery(
    options: IPaginationOptions,
    queryOptions: UrlQueryDto,
    ): Promise<Pagination<Url>> {
    let { starttime, endtime, sorttype, id, tmp } = queryOptions;
    if (['DESC', 'ASC'].indexOf(sorttype) === -1) {
      sorttype = 'DESC';
    }
    const queryBuilder = this.urlRepository.createQueryBuilder('url')

    if (starttime !== undefined) { queryBuilder.where('url.updatetime >= :starttime', { starttime }) }
    if (endtime !== undefined) { queryBuilder.andWhere('url.updatetime <= :endtime', { endtime }) }
    if (id !== undefined) { queryBuilder.andWhere('url.id = :id', { id }) }
    if (tmp !== undefined) { queryBuilder.andWhere('url.tmp = :tmp', { tmp }) }
    // if (user_id !== undefined) { queryBuilder.andWhere('url.user_id = :user_id', { user_id }) }

    // if (like !== '') { queryBuilder.andWhere('url.describe LIKE :like', { like: '%'+like+'%' }) }
    queryBuilder.orderBy('url.createtime', sorttype)
    return await paginate<Url>(queryBuilder, options);
  }

  // async setPublish(id: number): Promise<Boolean> {
  //   let urltmpdb = await this.urlRepository.findOneOrFail({ id })
  //   let urltmppublished = await this.urlRepository.findOneOrFail({ publish: true });
  //   if (urltmppublished) {
  //     urltmppublished.publish = false;
  //     this.urlRepository.save(urltmppublished)
  //   }
  //   if (urltmpdb) {
  //     urltmpdb.publish = true;
  //     urltmpdb.publishtime = new Date().getTime();
  //     if(await this.urlRepository.save(urltmpdb)) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } else {
  //     return false;
  //   }
  // }

  async copyUrlTmp(id: number): Promise<Url> {
    let destUrltmp = await this.urlRepository.findOneOrFail({ id });
    if (destUrltmp) {
      let urltmp = this.urlRepository.create();
      urltmp.createtime = new Date().getTime();
      urltmp.updatetime = new Date().getTime();
      urltmp.publishtime = 0;
      urltmp.publish = false;
      urltmp.list = destUrltmp.list;
      urltmp.tag = destUrltmp.tag;
      urltmp.group_transfer = destUrltmp.group_transfer;
      urltmp.site_transfer = destUrltmp.site_transfer;
      urltmp.search_site = destUrltmp.search_site;
      urltmp.tmp = true;
      urltmp.user_id = -1;
      if (await this.urlRepository.save(urltmp)) {
        return urltmp;
      } else {
        return null;
      }
    }
  }

  async createUrlTmp(): Promise<Url> {
    let urltmp = this.urlRepository.create();
    urltmp.createtime = new Date().getTime();
    urltmp.updatetime = new Date().getTime();
    urltmp.publish = false;
    urltmp.list = JSON.stringify([]);
    urltmp.tag = JSON.stringify([]);
    urltmp.tmp = true;
    urltmp.user_id = -1;
    urltmp.group_transfer = JSON.stringify([]);
    urltmp.site_transfer = JSON.stringify([]);
    urltmp.search_site = JSON.stringify([]);
    urltmp.publish = false;
    urltmp.publishtime = 0;
    if (await this.urlRepository.save(urltmp)) {
      return urltmp;
    } else {
      return null;
    }
  }
  async createFirstUrlTmp(): Promise<Url> {
    let urltmp= await this.urlRepository.findOne({ tmp: true });
    if (!urltmp) {
      let firstUurltmp = this.urlRepository.create();
      firstUurltmp.createtime = new Date().getTime();
      firstUurltmp.updatetime = new Date().getTime();
      firstUurltmp.publish = true;
      firstUurltmp.list = JSON.stringify([]);
      firstUurltmp.tag = JSON.stringify([]);
      firstUurltmp.tmp = true;
      firstUurltmp.user_id = -1;
      firstUurltmp.group_transfer = JSON.stringify([]);
      firstUurltmp.site_transfer = JSON.stringify([]);
      urltmp.search_site = JSON.stringify([]);
      firstUurltmp.publish = false;
      firstUurltmp.publishtime = 0;
      if (await this.urlRepository.save(firstUurltmp)) {
        return firstUurltmp;
      } else {
        return null;
      }
    }
  }
  async deleteUrltmmp(id: number): Promise<Boolean> {
    console.log(id)
    let urltmp = await this.urlRepository.findOneOrFail({ id, tmp: true });
    urltmp = await this.urlRepository.remove(urltmp);
    if (urltmp && urltmp.id === undefined) {
      return true;
    } else {
      return false;
    }
  }
}
