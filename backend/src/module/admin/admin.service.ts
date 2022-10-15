import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Porder, User, Url, EmailToken, Website } from 'src/shared/entity';
import { IPaginationOptions, Pagination, paginate } from '../../lib/nestjs-typeorm-paginate';
import { UrltmpQueryDto } from 'src/shared/dto/urltmp-query.dto';
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Porder) private readonly porderRepository: Repository<Porder>,
    @InjectRepository(Url) private readonly urlRepository: Repository<Url>,
    @InjectRepository(EmailToken) private readonly emailRepository: Repository<EmailToken>,
    @InjectRepository(Website) private readonly websiteRepository: Repository<Website>){}
}
