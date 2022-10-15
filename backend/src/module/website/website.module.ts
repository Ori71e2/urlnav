import { Module } from '@nestjs/common';
import { WebsiteService } from './website.service';
import { WebsiteController } from './website.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Website } from 'src/shared/entity';

@Module({
  imports: [TypeOrmModule.forFeature([Website])],
  providers: [WebsiteService],
  controllers: [WebsiteController],
  exports: [WebsiteService]
})
export class WebsiteModule {}
