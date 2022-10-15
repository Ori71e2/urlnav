import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { EmailService } from './email.service';
import { IResponse } from 'src/shared/common/interfaces/response.interface';
import { CResponse } from 'src/shared/common/dto/response.dto';
import { RES, ROLE } from 'src/shared/common/constrant';
import { JwtAuthGuard } from 'src/shared/common/guards/jwtauth.guard';
import { RolesGuard } from 'src/shared/common/guards/role.guard';
import { Role } from 'src/shared/common/decorators/role.decorator';
@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
  ) {}
  @Get('token/:email')
  public async sentEmailToken(@Param() params): Promise<IResponse> {
    try {
      await this.emailService.createEmailToken(params.email);
      let sent = await this.emailService.sentEmailToken(params.email);
      if (sent) {
        return new CResponse(RES.SUCCESS);
      } else {
        return new CResponse(RES.CERROR_EMAIL_SENT);
      }
    } catch(e) {
      return new CResponse(RES.CERROR_EMAIL_SENT, e);
    }
  }
}
