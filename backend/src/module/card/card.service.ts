import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import stringRandom = require('string-random');
import * as bcrypt from 'bcryptjs';
import { User, Card } from 'src/shared/entity';
import { IPaginationOptions, Pagination, paginate } from '../../lib/nestjs-typeorm-paginate';
import { CardQueryDto } from 'src/shared/dto/card-query.dto';
import { CardDto } from 'src/shared/dto/card.dto';
import { default as STEP } from './step.constant';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
    @InjectRepository(User) private readonly userReposiyory: Repository<User>
  ) {}
  async generate(number: number): Promise<Boolean> {
    try {
      let timestamp = new Date().getTime();
      for (let i=0; i<number; i++) {
        let card = this.cardRepository.create();
        card.cardno = '' + timestamp + 'VIP'
        card.cardpwd = stringRandom(15, { numbers: true, letters: true }).toUpperCase();
        card.step = STEP.CREATED
        card.usedtime = 0
        card.exportedtime = 0
        card.createtime = new Date().getTime();
        card.user_id = 0
        timestamp += 1;
        this.cardRepository.save(card);
      }
      return true
    } catch(e) {
      return false
    }
  }
  // async verify(user_id: number, cardno: string, cardpwd: string): Promise<User> {
  //   const card = await this.cardRepository.findOneOrFail({ cardno: cardno, cardpwd: cardpwd, used: false })
  //   // const card = await this.cardRepository.findOneOrFail({ cardno: cardno, cardpwd: cardpwd, exported: true, used: false })
  //   const user = await this.userReposiyory.findOneOrFail({ id: user_id })
  //   if (card && user) {
  //     card.step = STEP.USED
  //     card.usedtime = new Date().getTime();
  //     card.user_id = user_id;
  //     if (user.vip_expiretime <= new Date().getTime()) {
  //       user.vip_expiretime = new Date().getTime() + 31536000000
  //     } else {
  //       user.vip_expiretime = user.vip_expiretime + 31536000000
  //     }
  //     await this.cardRepository.save(card)
  //     await this.userReposiyory.save(user)
  //     return user
  //   } else {
  //     return null
  //   }
  // }
  async paginateQuery(
    options: IPaginationOptions,
    queryOptions: CardQueryDto,
    ): Promise<Pagination<Card>> {
    let { id, user_id, cardno, cardpwd, created, waited, used, exported, sorttype } = queryOptions;
    if (['DESC', 'ASC'].indexOf(sorttype) === -1) {
      sorttype = 'DESC';
    }
    const step = []
    if (created !== null && created !== undefined && created) { step.push(STEP.CREATED) }
    if (used !== null && used !== undefined && used) { step.push(STEP.USED) }
    if (exported !== null && exported !== undefined && exported) { step.push(STEP.EXPORTED) }
    if (waited !== null && waited !== undefined && waited) { step.push(STEP.WAITING) }
    const queryBuilder = this.cardRepository.createQueryBuilder('card')

    if (id !== null && id !== undefined) { queryBuilder.andWhere('card.id = :id', { id }) }
    if (cardno !== null && cardno !== undefined) { queryBuilder.andWhere('card.cardno = :cardno', { cardno }) }
    if (cardpwd !== null && cardpwd !== undefined) { queryBuilder.andWhere('card.cardpwd = :cardpwd', { cardpwd }) }
    if (step.length !== 0) {
      queryBuilder.andWhere('card.step IN (:...step)', { step })
    }
    if (user_id !== null && user_id !== undefined) { queryBuilder.andWhere('card.user_id = :user_id', { user_id }) }

    // if (like !== '') { queryBuilder.andWhere('card.describe LIKE :like', { like: '%'+like+'%' }) }
    queryBuilder.orderBy('card.id', sorttype)
    return await paginate<Card>(queryBuilder, options);
  }
  // async updateCards(cards: Array<CardDto>): Promise<Boolean> {
  //   cards.forEach((card) => {
  //     try{
  //       this.cardRepository.update(card.id, { exported: card.exported })
  //     } catch(e) {
  //     }
  //   })
  //   return true
  // }
  async setCardsWaiting(cards: Array<CardDto>): Promise<Boolean> {
    cards.forEach((card) => {
      try{
        this.cardRepository.update(card.id, { step: STEP.WAITING })
      } catch(e) {
      }
    })
    return true
  }
  async setCardsExported(cards: Array<CardDto>): Promise<Boolean> {
    cards.forEach((card) => {
      try{
        this.cardRepository.update(card.id, { step: STEP.EXPORTED })
      } catch(e) {
      }
    })
    return true
  }

  // async update(card: CardDto): Promise<Boolean> {
  //   try{
  //     this.cardRepository.update(card.id, { exported: card.exported })
  //     return true
  //   } catch(e) {
  //     return false
  //   }
  // }
}
