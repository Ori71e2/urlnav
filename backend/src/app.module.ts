import { Module, MiddlewareConsumer,  } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { UserModule } from './module/user/user.module';
import { UrlModule } from './module/url/url.module';
import { AuthModule } from './module/auth/auth.module';
import { WebsiteModule } from './module/website/website.module';
import { AdminModule } from './module/admin/admin.module';
import { PayModule } from './pay/pay.module';
import { CardModule } from './module/card/card.module';
import { EmailModule } from './module/email/email.module';
import { InitModule } from './init/init.module';
import { InittranacService } from './transaction/inittranac.service';
import { UserService } from './module/user/user.service';
import { LoggerMiddleware } from './shared/common/middlewares/logger.middleware';
import { User, Url } from './shared/entity';
import { UrlService } from './module/url/url.service';
// import { ConfigModule, ConfigService } from 'nestjs-config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import customConfig from './config/index';
// import { APP_INTERCEPTOR } from '@nestjs/core';

// import * as path from 'path';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 作用于全局
      load: [customConfig], // 加载自定义配置项
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // 数据库配置项依赖于ConfigModule，需在此引入
      useFactory: (configService: ConfigService) => configService.get('DATABASE_CONFIG'),
      inject: [ConfigService], // 记得注入服务，不然useFactory函数中获取不到ConfigService
    }),
    // CacheModule.registerAsync({
    //   useFactory: () => ({
    //     ttl: 5,
    //   }),
    // }),
    UserModule,
    UrlModule,
    AuthModule,
    WebsiteModule,
    AdminModule,
    // PayModule,
    CardModule,
    EmailModule,
    TypeOrmModule.forFeature([User, Url]),
    InitModule,
  ],
  // controllers: [],
  // controllers: [CardController],
  providers: [
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
    InittranacService,
    UserService
  ]
})
export class AppModule {
  constructor(private readonly connection: Connection,
    private readonly config: ConfigService,
    private initService: InittranacService,
    private userService: UserService,
    private urlService: UrlService) {}
  public async configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      // .exclude(
      //   { path: 'example', method: RequestMethod.GET },
      // )
  }
}
