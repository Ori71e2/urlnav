import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, InsertResult } from 'typeorm';
import { User } from 'src/shared/entity';
import * as bcrypt from 'bcryptjs';
import { UserProfileDto } from 'src/shared/dto/user-profile.dto';
import {default as config} from 'src/config';
import { IPaginationOptions, Pagination, paginate } from 'src/lib/nestjs-typeorm-paginate';
import { UserQueryDto } from 'src/shared/dto/user-query.dto';
import { UserDto } from 'src/shared/dto/user.dto';
import { ConfigService } from '@nestjs/config';
import { ROLE } from 'src/shared/common/constrant';
let AUTH: any;
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService
  ) {
    AUTH = this.configService.get('AUTH')
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({email: email});
  }
  async findById(id: number): Promise<User> {
    return await this.userRepository.findOneOrFail({ id });
  }
  async setPassword(email: string, newPassword: string): Promise<boolean> { 
    var user = await this.userRepository.findOneOrFail({ email: email});
    if(!user) throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    
    user.password = await bcrypt.hash(newPassword, AUTH.saltRounds);

    if (await this.userRepository.save(user)) {
      return true
    } else {
      throw new HttpException('LOGIN.PASSWORD_SET_FAILURE', HttpStatus.NOT_FOUND);
    }
  }
  async verifyOpcode(id: number, opcode: string): Promise<true> {
    const user = await this.userRepository.findOneOrFail({ id: id, opcode: opcode });
    if (user.vip_expiretime >= new Date().getTime()) {
      return true
    } else {
      throw new HttpException('USER.OPCODE_VERIFY_NOT_VIP.ERROR', HttpStatus.FORBIDDEN);
    }
  }
  async setOpcode(id: number, password: string, opcode: string): Promise<boolean> {
    const user = await this.userRepository.findOneOrFail({ id: id });
    const isValidPass = await bcrypt.compare(password, user.password);
    if (isValidPass) {
      user.opcode = opcode;
      await this.userRepository.save(user)
      return true
    } else {
      throw new HttpException('USER.OPCODE_SET.ERROR', HttpStatus.NOT_FOUND);
    }    
  }
  async updateProfile(userProfile: UserProfileDto): Promise<boolean>{
    let user = await this.userRepository.findOneOrFail({ id: userProfile.id });
    if(!user) { throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND); }
      user.name = userProfile.name;
    if (await this.userRepository.save(user)) {
      return true
    } else {
      throw new HttpException('LOGIN.PROFILE_SET_FAILURE', HttpStatus.NOT_FOUND);
    }
  }

  async paginateQuery(
    options: IPaginationOptions,
    queryOptions: UserQueryDto,
    ): Promise<Pagination<User>> {
    let { starttime, endtime, sorttype, id, name, email, vip, role, active} = queryOptions;
    if (['DESC', 'ASC'].indexOf(sorttype) === -1) {
      sorttype = 'DESC';
    }
    const nowTime = new Date().getTime()
    const queryBuilder = this.userRepository.createQueryBuilder('user')

    if (starttime !== undefined) { queryBuilder.where('user.vip_expiretime >= :starttime', { starttime }) }
    if (endtime !== undefined) { queryBuilder.andWhere('user.vip_expiretime <= :endtime', { endtime }) }
    if (id !== undefined) { queryBuilder.andWhere('user.id = :id', { id }) }
    if (name !== undefined) { queryBuilder.andWhere('user.name = :name', { name }) }
    if (email !== undefined) { queryBuilder.andWhere('user.email = :email', { email }) }
    if (vip !== undefined) {
        if (vip) {
        queryBuilder.andWhere('user.vip_expiretime >= :nowTime', { nowTime })
      } else {
        console.log(vip)
        queryBuilder.andWhere('user.vip_expiretime < :nowTime', { nowTime })
      }
    }
    if (role !== undefined) { queryBuilder.andWhere('user.role = :role', { role }) }
    if (active !== undefined) { queryBuilder.andWhere('user.active = :active', { active }) }

    // if (like !== '') { queryBuilder.andWhere('user.describe LIKE :like', { like: '%'+like+'%' }) }
    queryBuilder.orderBy('user.createtime', sorttype)
    return await paginate<User>(queryBuilder, options);
  }

  async updateUser( user: UserDto ): Promise<User> {
    let userdb = await this.userRepository.findOneOrFail({ id: user.id })
    userdb.active = user.active;
    // userdb.name = user.name;
    userdb.role = user.role;
    userdb.vip_expiretime = user.vip_expiretime;
    if ((userdb.role === ROLE.HUMAN || userdb.role === ROLE.REGISTER) && userdb.vip_expiretime > new Date().getTime()) {
      userdb.role = ROLE.VIP
    }
    return await this.userRepository.save(userdb)
  }
}