import { getManager } from "typeorm";
import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { Url } from '../shared/entity'
import { resolve } from "path";

@Injectable()
export class UrltranService {
  constructor() {}
  async setPublished(id: number): Promise<Url> {
    let urlPublish: Url = null
    return await getManager().transaction(async entityManager => {
      let urlPublished: Url = await entityManager.findOne(Url, { publish: true });
      urlPublish = await entityManager.findOneOrFail(Url, { id });
      if(urlPublished){
        urlPublished.publish = false;
        await entityManager.save(Url, urlPublished);
      }

      urlPublish.publish = true;
      urlPublish.publishtime = new Date().getTime();
      await entityManager.save(Url, urlPublish);
    })
    .then(() => {
      return urlPublish
    })
    .catch((e) => {
      throw new HttpException('REGISTRATION.DATABASE_INSERT_FAILURE', HttpStatus.FORBIDDEN);
    })
  }
}
