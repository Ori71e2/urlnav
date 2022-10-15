import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class Website {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 2048 })
  url: string;

  @Index()
  @Column({ type: 'bigint' })
  rank: number;

  @Column({ default: '' })
  describe: string;

  @Column({ default: false})
  recommend: boolean;
}