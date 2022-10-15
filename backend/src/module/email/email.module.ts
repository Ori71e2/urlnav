import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailToken, EmailTran } from 'src/shared/entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailToken, EmailTran]),
    MailerModule.forRootAsync({
      imports: [ConfigModule], // 数据库配置项依赖于ConfigModule，需在此引入
      useFactory: (configService: ConfigService) => {
        // 将配置文件中MAIL改为EMAIL，否则root权限下执行，程序会将MAIL覆盖掉，不知道哪来的bug
        const EMAIL = configService.get('EMAIL');
        return  { 
          // transport: 'smtps://' + EMAIL.user + ':' + EMAIL.pass + '@' + EMAIL.host + ':' + EMAIL.port,
          // transport: {
          //   pool: true,
          //   host: EMAIL.host,
          //   port: EMAIL.port,
          //   secure: true,
          //   auth: {
          //     user: EMAIL.user,
          //     pass: EMAIL.pass,
          //   },
          //   // requireTLS: true,
          //   // secureConnection: true,
          //   // tls:{
          //   //   rejectUnAuthorized: false
          //   // }
          // },
          transports: {
            // test1: {
            //   pool: true,
            //   host: EMAIL.host,
            //   port: EMAIL.port,
            //   secure: true,
            //   auth: {
            //     user: EMAIL.user,
            //     pass: EMAIL.pass,
            //   }
            //   // requireTLS: true,
            //   // secureConnection: true,
            //   // tls:{
            //   //   rejectUnAuthorized: false
            //   // }
            // }
          },
          template: {
            dir: process.cwd() + '/template/',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true
            }
          }
          // defaults: {
          //   from: '"domain.com" <no-reply@domain.com>'
          // },
        }
      },
      inject: [ConfigService], // 记得注入服务，不然useFactory函数中获取不到ConfigService
      // transport: 'smtps://xxx@163.com:pass@smtp.163.com',
    })
  ],
  controllers: [EmailController],
  providers: [EmailService]
})

export class EmailModule {}
