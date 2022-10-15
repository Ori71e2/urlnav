import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { JwtStrategy } from './jwt.strategy';
import { JWTService } from './jwt.service';
import { User, EmailToken, EmailTran } from 'src/shared/entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from 'src/shared/common/middlewares/logger.middleware';
import { InittranacService } from '../../transaction/inittranac.service';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, EmailToken, EmailTran]),
  ],
  providers: [ConfigService, AuthService, UserService, InittranacService,JWTService, JwtStrategy, EmailService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule{}
