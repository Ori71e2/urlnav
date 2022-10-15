import * as bcrypt from 'bcryptjs'; 
import { Injectable, HttpException, HttpStatus, HttpService } from '@nestjs/common';
import { JWTService } from './jwt.service';
import { User, EmailToken } from 'src/shared/entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IPaginationOptions, Pagination, paginate } from 'src/lib/nestjs-typeorm-paginate';
import { EmailQueryDto } from 'src/shared/dto/email-query.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { RES } from 'src/shared/common/constrant';
let AUTH: any;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(EmailToken) private readonly emailRepository: Repository<EmailToken>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) {
    AUTH = this.configService.get('AUTH');
  }

  async validateLogin(email: string, password: string): Promise<{ token: string, user: User}> {
    let user = await this.userRepository.findOne({ email: email});
    if(!user) throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    if(!user.active) throw new HttpException('LOGIN.ACCOUNT_IS_PROHIBIT', HttpStatus.FORBIDDEN);
    // password = await bcrypt.hash(password, AUTH.saltRounds);
   
    let isValidPass = await bcrypt.compare(password, user.password);
    if(isValidPass){
      const accessToken = JWTService.createToken(email, user.role);
      return { token: accessToken, user: user }
    } else {
      console.log('error')
      throw new HttpException('LOGIN.ERROR', HttpStatus.UNAUTHORIZED);
    }
  }
  async validatePassword(email: string, oldPassword: string): Promise<boolean> {
    let user = await this.userRepository.findOne({ email: email });
    if(!user) throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    if(!user.active) throw new HttpException('LOGIN.ACCOUNT_IS_PROHIBIT', HttpStatus.FORBIDDEN);
    // password = await bcrypt.hash(password, AUTH.saltRounds);
    const isValidPass = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPass) {
      throw new HttpException('old password error', RES.CERROR_USER_PASSWORD_UPDATE.code);
    }

    return isValidPass
  }
  async paginateQuery(
    options: IPaginationOptions,
    queryOptions: EmailQueryDto,
    ): Promise<Pagination<EmailToken>> {
    let { starttime, endtime, id, email, emailToken, trytimes, sorttype } = queryOptions;
    if (['DESC', 'ASC'].indexOf(sorttype) === -1) {
      sorttype = 'DESC';
    }
    const queryBuilder = this.emailRepository.createQueryBuilder('email')

    if (starttime !== undefined) { queryBuilder.where('email.createtime >= :starttime', { starttime }) }
    if (endtime !== undefined) { queryBuilder.andWhere('email.createtime <= :endtime', { endtime }) }
    if (id !== undefined) { queryBuilder.andWhere('email.id = :id', { id }) }
    if (email !== undefined) { queryBuilder.andWhere('email.email = :email', { email }) }
    if (emailToken !== undefined) { queryBuilder.andWhere('email.payjs_order_id = :payjs_order_id', { emailToken }) }
    if (trytimes !== undefined) { queryBuilder.andWhere('email.user_id = :user_id', { trytimes }) }

    // if (like !== '') { queryBuilder.andWhere('email.describe LIKE :like', { like: '%'+like+'%' }) }
    queryBuilder.orderBy('email.createtime', sorttype)
    return await paginate<EmailToken>(queryBuilder, options);
  }
}
