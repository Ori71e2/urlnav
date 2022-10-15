import { Module } from '@nestjs/common';
import { InitService } from './init.service';
import { InitController } from './init.controller';
import { InittranacService } from 'src/transaction/inittranac.service';
import { UserService } from 'src/module/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/shared/entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [InitService, InittranacService, UserService],
  controllers: [InitController],
  exports: [InitService]
})
export class InitModule {}
