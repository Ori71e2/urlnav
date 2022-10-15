import { Controller, Post, Request, Body, UseGuards} from '@nestjs/common';
import { Card } from 'src/shared/entity/card.entity';
import { CardService } from './card.service';
import { AuthGuard } from '@nestjs/passport';
import { IResponse } from 'src/shared/common/interfaces/response.interface';
import { CResponse } from 'src/shared/common/dto/response.dto';
import { CardDto } from 'src/shared/dto/card.dto';
import { CardtranacService } from 'src/transaction/cardtranac.service';
import { UserService } from '../user/user.service';
import { RES } from 'src/shared/common/constrant';
import { JwtAuthGuard } from 'src/shared/common/guards/jwtauth.guard';
@Controller('card')
@UseGuards(JwtAuthGuard)
export class CardController {
  constructor(
    private readonly cardService: CardService,
    private readonly cardtranacService: CardtranacService,
    private readonly userService: UserService) {}
  @Post('verify')
  async verify(@Request() req: Request | any, @Body() body: CardDto): Promise<IResponse> {
    try {
      const user_id = req.user.id;
      const cardno = body.cardno;
      const cardpwd = body.cardpwd;
      await this.cardtranacService.verify(user_id, cardno, cardpwd);
      const user = await this.userService.findById(user_id);
      return new CResponse(RES.SUCCESS, { vip_expiretime: user.vip_expiretime });
    } catch (e) {
      return new CResponse(RES.CERROR_CARD_NOT_FOUND, e);
    }
  }
}
