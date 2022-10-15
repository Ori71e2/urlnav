import { Controller, Get, Query, Post, Body, Request, Redirect, ParseIntPipe, ParseBoolPipe, UseGuards } from '@nestjs/common';
import { IResponse } from 'src/shared/common/interfaces/response.interface';
import { CResponse} from 'src/shared/common/dto/response.dto';
import { CardService } from '../../card/card.service';
import { CardDto } from 'src/shared/dto/card.dto';
import { CParseIntPipe } from 'src/shared/common/pipes/cparse-int.pipe';
import { CParseBooleanPipe } from 'src/shared/common/pipes/cparse-boolean.pipe';
import { RolesGuard } from 'src/shared/common/guards/role.guard';
import { Role } from 'src/shared/common/decorators/role.decorator';
import { ROLE } from 'src/shared/common/constrant';
import { JwtAuthGuard } from 'src/shared/common/guards/jwtauth.guard';
import { RES } from 'src/shared/common/constrant';
import { ConfigService } from '@nestjs/config';
import { OpcodeGuard } from 'src/shared/common/guards/opcode.guard';

@UseGuards(JwtAuthGuard, RolesGuard, OpcodeGuard)
@Role(ROLE.ADMIN)
@Controller('admin/card')
export class AdminCardController {
  constructor(
    private readonly cardService: CardService,
    private readonly configService: ConfigService
  ) {}

  @Get('generate')
  async generate(@Query('number') number: number): Promise<IResponse> {
    try {
      let result: Boolean = await this.cardService.generate(number);
      if (!result) {
        return new CResponse(RES.CERROR_CARD_GENERAATE);
      }
      return new CResponse(RES.SUCCESS);
    } catch (e) {
      return new CResponse(RES.CERROR_CARD_GENERAATE, e);
    }
  }
  // @Post('updateCards')
  // async updateCards(@Body() body: Array<CardDto>): Promise<IResponse> {
  //   const cards = body
  //   try {
  //     let result: Boolean = await this.cardService.updateCards(cards);
  //     if (!result) {
  //       return new ResponseError(50000, "CARDS.UPDATE.ERROR");
  //     }
  //     return new ResponseSuccess("CARDS.UPDATE.SUCCESS");
  //   } catch (e) {
  //     return new ResponseError(50000, "CARDS.UPDATE.ERROR", e);
  //   }
  // }
  @Post('setWaiting')
  async setCardsWaiting(@Body() body: Array<CardDto>): Promise<IResponse> {
    const cards = body
    try {
      let result: Boolean = await this.cardService.setCardsWaiting(cards);
      if (!result) {
        return new CResponse(RES.CERROR_CARD_UPDATE);
      }
      return new CResponse(RES.SUCCESS);
    } catch (e) {
      return new CResponse(RES.CERROR_CARD_UPDATE, e);
    }
  }
  @Post('setExported')
  async setCardsExported(@Body() body: Array<CardDto>): Promise<IResponse> {
    const cards = body
    try {
      let result: Boolean = await this.cardService.setCardsExported(cards);
      if (!result) {
        return new CResponse(RES.CERROR_CARD_EXPORTED);
      }
      return new CResponse(RES.SUCCESS);
    } catch (e) {
      return new CResponse(RES.CERROR_CARD_EXPORTED, e);
    }
  }
  // @Post('update')
  // async updateCard(@Body() body: CardDto): Promise<IResponse> {
  //   const card = body
  //   try {
  //     let result: Boolean = await this.cardService.update(card);
  //     if (!result) {
  //       return new ResponseError(50000, "CARD.UPDATE.ERROR");
  //     }
  //     return new ResponseSuccess("CARD.UPDATE.SUCCESS");
  //   } catch (e) {
  //     return new ResponseError(50000, "CARD.UPDATE.ERROR", e);
  //   }
  // }
  @Get('list')
  async cardPaginateQuery(
    @Query('page', CParseIntPipe) page: number = 1,
    @Query('limit', CParseIntPipe) limit: number = 15,
    @Query('sorttype') sorttype: 'DESC' | 'ASC',
    @Query('user_id', CParseIntPipe) user_id: number,
    @Query('cardno') cardno: string,
    @Query('cardpwd') cardpwd: string,
    @Query('created', CParseBooleanPipe) created: boolean,
    @Query('waited', CParseBooleanPipe) waited: boolean,
    @Query('used', CParseBooleanPipe) used: boolean,
    @Query('exported', CParseBooleanPipe) exported: boolean): Promise<IResponse> {
    try {
      console.log(typeof(used))
      limit = limit > 500 ? 500 : limit;
      let data = await this.cardService.paginateQuery(
        {
          page,
          limit,
          route: this.configService.get('HOST').url + '/admin/card/list'
        },
        { cardno,
          cardpwd,
          created,
          waited,
          used,
          exported,
          sorttype,
          user_id
        }
      );
      return new CResponse(RES.SUCCESS, data);
    } catch(e) {
      return new CResponse(RES.CERROR_CARD_SEARCH, e);
    }
  }
}