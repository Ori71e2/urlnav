import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      "type": "mysql",
      "host": "localhost",
      "port": 3306,
      "username": "root",
      "password": "syy83753051",
      "database": "test",
      "entities": ["entity/*.entity{.ts,.js}"],
      "synchronize": true
    }),
  ],
  controllers: []
})
export class testAppModule {
  constructor(private readonly connection: Connection) {}
}
