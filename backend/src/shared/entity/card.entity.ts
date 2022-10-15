import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 24 })
  cardno: string;

  @Column( { length: 24 })
  cardpwd: string;

  @Column({ default: false })
  exported: boolean;

  @Column({ default: false })
  used: boolean;

  @Column({ default: 0 })
  step: number;

  @Column({ type: 'bigint' })
  exportedtime: number;

  @Column({ type: 'bigint' })
  usedtime: number;

  @Column({ type: 'bigint' })
  createtime: number;

  @Column()
  user_id: number;
}