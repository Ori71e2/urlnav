import * as jwt from 'jsonwebtoken';
import {default as config} from '../../config';
import { Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/shared/entity';
import { ConfigService } from '@nestjs/config';
let JWT: any;
@Injectable()
export class JWTService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService
    ) {
      JWT = this.configService.get('JWT');
    }

  static createToken(email: string, role: number) {
    const expiresIn = JWT.expiresIn;
    const secretOrKey = JWT.secretOrKey;
    const userInfo = { email: email, role: role };
    const token = jwt.sign(userInfo, secretOrKey, { expiresIn });
    return token
  }

  static decodeToken(token: string) {
    return jwt.decode(token)
  }

  async validateUser(signedUser: any): Promise<User> {
    const user = await this.userRepository.findOne({ email: signedUser.email});
    if (user) {
      return user;
    }
    return null;
  }

  cookieExtractor(req) {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies.authorization;
    }
    return token;
  }
}
