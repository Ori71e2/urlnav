import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailToken, EmailTran } from 'src/shared/entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { TokenRandom } from 'src/shared/common/util/token-random';
import { EmailTokenDto } from 'src/shared/dto/email-token.dto';
import { IPaginationOptions, Pagination, paginate } from 'src/lib/nestjs-typeorm-paginate';
import { EmailQueryDto } from 'src/shared/dto/email-query.dto';
import { ConfigService } from '@nestjs/config';
import { EmailTranDto } from 'src/shared/dto/email-tran.dto';
import { EmailTranQueryDto } from 'src/shared/dto/email-tran-query.dto';

let EMAIL: any
@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailToken) private readonly emailTokenRepository: Repository<EmailToken>,
    @InjectRepository(EmailTran) private readonly emailTranRepository: Repository<EmailTran>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) {
    EMAIL = this.configService.get('EMAIL')
  }
  async test(id: number, testEmailReceiver: string): Promise<Boolean> {
    const emailTran: EmailTranDto = await this.emailTranRepository.findOne({ id })
    this
    .mailerService
    .addTransporter(
      emailTran.name,
      {
      // pool: true,
      host: emailTran.host,
      port: emailTran.port,
      // secure: true,
      ignoreTLS: true,
      auth: {
        user: emailTran.user,
        pass: emailTran.pass,
      },
      // requireTLS: true,
      secureConnection: true,
      tls:{
        rejectUnAuthorized: false
      }
    },)
    let result = await this
      .mailerService
      .sendMail({
        to: testEmailReceiver, // list of receiver
        from: emailTran.user, // sender address,必须和邮箱配置一样
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        html: '<b>welcome</b>', // HTML body content
        transporterName: emailTran.name
      })
      .then(() => {
        return true;
      })
      .catch((e) => {
        console.log(e)
        return false;
      });
    return result;
  }
  async createEmailTran(mailTran: EmailTranDto): Promise<EmailTranDto> {
    let newEmailTran: EmailTranDto = this.emailTranRepository.create();
    newEmailTran.name = mailTran.name;
    newEmailTran.host = mailTran.host;
    newEmailTran.port = mailTran.port;
    newEmailTran.user = mailTran.user;
    newEmailTran.pass = mailTran.pass;
    newEmailTran.active = false;
    newEmailTran.createtime = new Date().getTime();
    await this.emailTranRepository.save(newEmailTran);
    return newEmailTran;
  }
  async updateEmailTran(emailTran: EmailTranDto): Promise<EmailTranDto> {
    let newEmailTran: EmailTran = await this.emailTranRepository.findOne({ id: emailTran.id });
    newEmailTran.name = emailTran.name;
    newEmailTran.host = emailTran.host;
    newEmailTran.port = emailTran.port;
    newEmailTran.user = emailTran.user;
    newEmailTran.pass = emailTran.pass;
    await this.emailTranRepository.save(newEmailTran);
    return newEmailTran;
  }
  async deleteEmailTran(id: number): Promise<boolean> {
    await this.emailTranRepository.delete(id);
    return true;
  }
  async setInactived(id: number): Promise<boolean> {
    let mailTran: EmailTran = await this.emailTranRepository.findOne({ id });
    mailTran.active = false;
    await this.emailTranRepository.save(mailTran);
    return true;
  }
  async eｍailTranPaginateQuery(
    options: IPaginationOptions,
    queryOptions: EmailTranQueryDto,
    ): Promise<Pagination<EmailTran>> {
    let { sorttype } = queryOptions;
    if (['DESC', 'ASC'].indexOf(sorttype) === -1) {
      sorttype = 'DESC';
    }
    const queryBuilder = this.emailTranRepository.createQueryBuilder('email')

    queryBuilder.orderBy('email.createtime', sorttype)
    return await paginate<EmailTran>(queryBuilder, options);
  }
  async createEmailToken(email: string): Promise<boolean> {
    let emailVerification = await this.emailTokenRepository.findOne({email: email});
    // 不存在，新建
    if (!emailVerification){
      let newEmail: EmailToken = this.emailTokenRepository.create();
      newEmail.email = email;
      newEmail.emailToken  = new TokenRandom().emailToekn(); //Generate 32 bytes string
      newEmail.trytimes = 5;
      newEmail.createtime = new Date().getTime();
      await this.emailTokenRepository.save(newEmail);
      return true;
    }
    // 存在，进行更新
    if (emailVerification && (new Date().getTime() - emailVerification.createtime) / 60000 < 2 ){
      throw new HttpException('EMAIL.EMAIL_SENDED_RECENTLY', HttpStatus.INTERNAL_SERVER_ERROR);
    } else {
      emailVerification.emailToken  = new TokenRandom().emailToekn(); //Generate 32 bytes string
      emailVerification.trytimes = 5;
      emailVerification.createtime = new Date().getTime();
      await this.emailTokenRepository.save(emailVerification);
      return true;
    }
  }

  async verifyEmailToekn(emailAndToken: EmailTokenDto): Promise<boolean> {
    let emailVerification = await this.emailTokenRepository.findOne( {email: emailAndToken.email});
    if (!emailVerification || !emailAndToken.emailToken || emailAndToken.emailToken === '') {
      throw new HttpException('EMAIL.TOKEN_NONE', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (emailVerification && (new Date().getTime() - emailVerification.createtime) / 60000 > 2) {
      throw new HttpException('EMAIL.EMAIL_TOKEN_EXPIRETIME', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (emailVerification && emailVerification.trytimes <= 0) {
      throw new HttpException('EMAIL.EMAIL_TOKEN_TOO_TRIES', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (emailVerification && emailVerification.emailToken === emailAndToken.emailToken.toString()) {
      return true;
    } else {
      emailVerification.trytimes -= 1;
      await this.emailTokenRepository.save(emailVerification)
      throw new HttpException('EMAIL.EMAIL_TOKEN_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async clearEmailToekn(email: string): Promise<boolean> {
    await this.emailTokenRepository.delete({ email })
    return true;
  }

  async sentEmailToken(email: string): Promise<boolean> {
    let emailDb = await this.emailTokenRepository.findOne({ email: email});
    const emailTran: EmailTranDto = await this.emailTranRepository.findOne({ 'active': true })
    this
    .mailerService
    .addTransporter(
      emailTran.name,
      {
      pool: true,
      host: emailTran.host,
      port: emailTran.port,
      secure: true,
      auth: {
        user: emailTran.user,
        pass: emailTran.pass,
      },
      // requireTLS: true,
      // secureConnection: true,
      // tls:{
      //   rejectUnAuthorized: false
      // }
    },)
    if(emailDb && emailDb.emailToken){
      const result: boolean = await this.mailerService.sendMail({
        transporterName: emailTran.name,
        to: email, // list of receiver
        from: emailTran.user, // sender address,必须和邮箱配置一样
        subject: '验证码', // Subject line
        text: 'Code', // plaintext body
        html: '您好！<br><br> 验证码：<br><br>' + '<b>' + emailDb.emailToken + '</b>'
      }).then(() => {
        return true;
      }).catch((e) => {
        console.log(e)
        return false;
      });
      // console.log(result)
      return result
    } else {
      return false
    }
  }

  async emailTokenPaginateQuery(
    options: IPaginationOptions,
    queryOptions: EmailQueryDto,
    ): Promise<Pagination<EmailToken>> {
    let { sorttype, email } = queryOptions;
    if (['DESC', 'ASC'].indexOf(sorttype) === -1) {
      sorttype = 'DESC';
    }
    const queryBuilder = this.emailTokenRepository.createQueryBuilder('email')
    if (email !== undefined) { queryBuilder.andWhere('user.email = :email', { email }) }

    queryBuilder.orderBy('email.createtime', sorttype)
    return await paginate<EmailToken>(queryBuilder, options);
  }
}
