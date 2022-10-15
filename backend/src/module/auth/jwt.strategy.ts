import {default as config} from '../../config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWTService } from './jwt.service';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ROLE, RES } from 'src/shared/common/constrant';
import { CResponse } from 'src/shared/common/dto/response.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly jwtService: JWTService,
    private readonly configService: ConfigService
  ) {
    super(
      {
        // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        jwtFromRequest: jwtService.cookieExtractor,
        passReqToCallback: true,
        secretOrKey: configService.get('JWT').secretOrKey,
      }
      // async (req, payload, next) => await this.verify(req, payload, next),
    );
    // passport.use(this);
  }

  public async validate(req: any, payload: any, done: Function) {
    try {
      const user = await this.jwtService.validateUser(payload);
      if (!user) {
        // return done(new UnauthorizedException(), false);
        throw new CResponse(RES.REDIRECT_AUTH_LOGIN);
        // return done(new CResponse(RES.REDIRECT_AUTH_LOGIN), false);
      }
      done(null, user);
      // return { userId: payload.sub, username: payload.username };
    } catch(error) {
      console.log(error)
      throw new CResponse(RES.REDIRECT_AUTH_LOGIN);
    }
  }
}
