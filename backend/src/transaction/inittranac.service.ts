import { getManager } from "typeorm";
import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { CreateUserDto } from '../shared/dto/create-user.dto';
import { User, Url} from '../shared/entity'
import * as bcrypt from 'bcryptjs';
import { ROLE } from '../shared/common/constrant';
import { ConfigService } from '@nestjs/config';
let AUTH: any;
@Injectable()
export class InittranacService {
  constructor(private readonly configService: ConfigService) {
    AUTH = this.configService.get('AUTH');
  }
  async init(createUser: CreateUserDto): Promise<boolean> {
    if(!this.isValidEmail(createUser.email) || !createUser.password){
      throw new HttpException('REGISTRATION.MISSING_MANDATORY_PARAMETERS', HttpStatus.FORBIDDEN);
    }

    return await getManager().transaction(async entityManager => {
      let user = entityManager.create(User);
      let url: Url = entityManager.create(Url);

      let userRegistered = await entityManager.findOne(User, { email: createUser.email });
      if(userRegistered){
        throw new HttpException('REGISTRATION.USER_ALREADY_REGISTERED', HttpStatus.FORBIDDEN);
      }
      user.password = await bcrypt.hash(createUser.password, AUTH.saltRounds);
      user.opcode = '';
      user.role = ROLE.REGISTER;
      user.active = true;
      user.name = createUser.name || '';
      user.email = createUser.email;
      user.vip_expiretime = 0;
      user.createtime = new Date().getTime();

      const urltmp = await entityManager.findOne(Url, { publish: true });
      if (urltmp) {
        url.list = urltmp.list;
        url.tag = urltmp.tag;
        url.group_transfer = urltmp.group_transfer;
        url.site_transfer = urltmp.site_transfer;
        url.search_site = urltmp.search_site;
      } else {
        url.list = JSON.stringify([]);
        url.tag = JSON.stringify([]);
        url.group_transfer = JSON.stringify([]);
        url.site_transfer = JSON.stringify([]);
        url.search_site = JSON.stringify([]);  
      }
      url.active = true;
      url.createtime = new Date().getTime();
      url.updatetime = new Date().getTime();
      url.publishtime = 0;
      url.publish = false;
      url.tmp = false;
      let user_id = await entityManager.save(User, user)
        .then((user) => { return user.id; })
        .catch((e) => { console.log(e); throw new HttpException('REGISTRATION.DATABASE_INSERT_FAILURE', HttpStatus.FORBIDDEN); });
      url.user_id = user_id;
      await entityManager.save(Url, url);
    })
    .then(() => {
      return true
    })
    .catch((e) => {
      console.log(e);
      throw new HttpException('REGISTRATION.DATABASE_INSERT_FAILURE', HttpStatus.FORBIDDEN);
    })
  }
  async initRoot(createUser: CreateUserDto): Promise<boolean> {
    if(!this.isValidEmail(createUser.email) || !createUser.password){
      throw new HttpException('REGISTRATION.MISSING_MANDATORY_PARAMETERS', HttpStatus.FORBIDDEN);
    }

    return await getManager().transaction(async entityManager => {
      let user = entityManager.create(User);
      let url: Url = entityManager.create(Url);

      let userRegistered = await entityManager.findOne(User, { email: createUser.email });
      if(userRegistered){
        throw new HttpException('REGISTRATION.USER_ALREADY_REGISTERED', HttpStatus.FORBIDDEN);
      }
      userRegistered = await entityManager.findOne(User, { role: ROLE.SUPER_ADMIN });
      if(userRegistered){
        throw new HttpException('REGISTRATION.USER_ALREADY_REGISTERED', HttpStatus.FORBIDDEN);
      }
      user.password = await bcrypt.hash(createUser.password, AUTH.saltRounds);
      user.opcode = '';
      user.role = ROLE.SUPER_ADMIN;
      user.active = true;
      user.name = createUser.name || '';
      user.email = createUser.email;
      user.vip_expiretime = new Date().getTime() + 99*365*24*60*60*1000;
      user.createtime = new Date().getTime();
      url.list = JSON.stringify([]);
      url.tag = JSON.stringify([]);
      url.group_transfer = JSON.stringify([]);
      url.site_transfer = JSON.stringify([]);
      url.search_site = JSON.stringify([]);
      url.createtime = new Date().getTime();
      url.updatetime = new Date().getTime();
      url.publishtime = 0;
      url.publish = false;
      url.tmp = false;
      url.active = true;
      let user_id = await entityManager.save(User, user)
        .then((user) => { return user.id; })
        .catch((e) => { console.log(e); throw new HttpException('REGISTRATION.DATABASE_INSERT_FAILURE', HttpStatus.FORBIDDEN); });
      url.user_id = user_id;
      await entityManager.save(Url, url);
    })
    .then(() => {
      return true;
    })
    .catch((e) => {
      console.log(e);
      throw new HttpException('REGISTRATION.DATABASE_INSERT_FAILURE', HttpStatus.FORBIDDEN);
    })
  }
  isValidEmail (email : string){
    if(email){
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    } else return false
  }
}
