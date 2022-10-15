import { getManager } from "typeorm";
import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { EmailTran } from '../shared/entity'
import { resolve } from "path";

@Injectable()
export class EmailtranacService {
  constructor() {}
  async setActived(id: number): Promise<EmailTran> {
    let EmailTranactive: EmailTran = null
    return await getManager().transaction(async entityManager => {
      let EmailTranactiveed: EmailTran = await entityManager.findOne(EmailTran, { active: true });
      EmailTranactive = await entityManager.findOneOrFail(EmailTran, { id });
      if(EmailTranactiveed){
        EmailTranactiveed.active = false;
        await entityManager.save(EmailTran, EmailTranactiveed);
      }
      EmailTranactive.active = true;
      EmailTranactive.activetime = new Date().getTime();
      await entityManager.save(EmailTran, EmailTranactive);
    })
    .then(() => {
      return EmailTranactive
    })
    .catch((e) => {
      throw new HttpException('REGISTRATION.DATABASE_INSERT_FAILURE', HttpStatus.FORBIDDEN);
    })
  }
}
