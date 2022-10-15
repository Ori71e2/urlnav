import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card, User } from 'src/shared/entity';
import { CardController } from './card.controller';
import { UserService } from '../user/user.service';
import { CardtranacService } from 'src/transaction/cardtranac.service';

@Module({
  imports: [TypeOrmModule.forFeature([Card, User])],
  providers: [CardService, UserService, CardtranacService],
  controllers: [CardController],
  exports: [CardService]
})
export class CardModule {}
