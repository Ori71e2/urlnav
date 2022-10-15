import { Module, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlService } from './url.service';
import { UserService } from 'src/module/user/user.service';
import { UrlController } from './controller/url.controller';
import { UrltmpController } from './controller/urltmp.controller';
import { Url, User } from 'src/shared/entity';

@Module({
  imports: [TypeOrmModule.forFeature([Url, User]),
  CacheModule.register({
    ttl: 100, // seconds
    max: 10, // maximum number of items in cache
  })
  ],
  providers: [UrlService, UserService],
  controllers: [UrlController, UrltmpController],
  exports: [UrlService]
})
export class UrlModule {}