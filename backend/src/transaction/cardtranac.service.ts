import { getManager } from "typeorm";
import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { CreateUserDto } from '../shared/dto/create-user.dto';
import { User, Card, Url} from '../shared/entity'
import * as bcrypt from 'bcryptjs';
import { TokenRandom } from '../shared/common/util/token-random';
import {default as config} from '../config';
import { ROLE } from '../shared/common/constrant';
import { resolve } from "path";
import { default as STEP } from 'src/module/card/step.constant';
@Injectable()
export class CardtranacService {
  constructor() {}
  async verify(user_id: number, cardno: string, cardpwd: string): Promise<boolean> {
    return await getManager().transaction(async entityManager => {
      let user: User = await entityManager.findOneOrFail(User, { id: user_id });
      let url: Url = await entityManager.findOneOrFail(Url, { user_id: user_id });
      let card: Card = await entityManager.findOneOrFail(Card, { cardno: cardno, cardpwd: cardpwd, used: false });
      card.step = STEP.USED
      card.usedtime = new Date().getTime();
      card.user_id = user_id;
      if (user.vip_expiretime <= new Date().getTime()) {
        user.vip_expiretime = new Date().getTime() + 31536000000
      } else {
        user.vip_expiretime = user.vip_expiretime + 31536000000
      }
      await entityManager.save(User, user);
      await entityManager.save(Card, card);
    })
    .then(() => {
      return true;
    })
    .catch((e) => {
      throw new HttpException('REGISTRATION.DATABASE_INSERT_FAILURE', HttpStatus.FORBIDDEN);
    })
  }
}
