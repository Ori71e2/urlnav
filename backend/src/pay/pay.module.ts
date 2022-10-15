import { Module } from '@nestjs/common';
import { PayService } from './pay.service';
import { PayController } from './pay.controller';
import { Porder, User } from '../shared/entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Porder, User]),
  ],
  providers: [PayService],
  controllers: [PayController],
  exports: [PayService]
})
export class PayModule {}
