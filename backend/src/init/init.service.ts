import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../shared/entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ROLE } from '../shared/common/constrant';

@Injectable()
export class InitService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService
  ) {}
  async isRootSet(): Promise<boolean> {
    let userdb = await this.userRepository.findOneOrFail({ role: ROLE.SUPER_ADMIN });
    if(userdb) {
      return true;
    } else {
      throw new HttpException('REGISTRATION.USER_ALREADY_REGISTERED', HttpStatus.FORBIDDEN);
    }
  }
}
