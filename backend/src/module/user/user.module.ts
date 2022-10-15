import { Module, NestModule, MiddlewareConsumer} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, EmailToken } from 'src/shared/entity';
import { LoggerMiddleware } from 'src/shared/common/middlewares/logger.middleware';
import { AuthService } from 'src/module/auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, EmailToken])],
  providers: [UserService, AuthService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule  implements NestModule{
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(UserController);
  }
}