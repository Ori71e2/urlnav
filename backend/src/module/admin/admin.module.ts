import { Module, CacheModule } from '@nestjs/common';
import { AdminController } from './controller/admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Porder, User, Url, EmailToken, Website, Card, EmailTran } from 'src/shared/entity';
import { PayService } from 'src/pay/pay.service';
import { UserService } from 'src/module/user/user.service';
import { UrlService } from 'src/module/url/url.service';
import { AuthService } from 'src/module/auth/auth.service';
import { JWTService } from 'src/module/auth/jwt.service';
import { InittranacService } from 'src/transaction/inittranac.service';
import { CardService } from 'src/module/card/card.service';
import { EmailService } from 'src/module/email/email.service';

import { AdminCardController } from './controller/admin.card.controller';
import { AdminUrlController } from './controller/admin.url.controller';
import { UrltranService } from 'src/transaction/urltran.service';
import { AdminUserController } from './controller/admin.user.controller';
import { AdminEmailTokenController } from './controller/admin.emaiToken.controller';
import { AdminEmailTranController } from './controller/admin.emailTran.controller';
import { EmailtranacService } from 'src/transaction/emailtranac.service ';

@Module({
  imports: [
    TypeOrmModule.forFeature([Porder, User, Url, EmailToken, Website, Card, EmailTran]),
    CacheModule.register({
      ttl: 100, // seconds
      max: 10, // maximum number of items in cache
    })
  ],
  controllers: [AdminController, AdminCardController, AdminUrlController, AdminUserController, AdminEmailTokenController, AdminEmailTranController],
  providers: [AdminService, PayService, UserService, UrlService, AuthService, JWTService, InittranacService, CardService, UrltranService, EmailService, EmailtranacService],
  exports: [AdminService]
})
export class AdminModule {}
