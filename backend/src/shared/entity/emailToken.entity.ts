import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EmailToken {
  @PrimaryGeneratedColumn()
  id: number;

  // email实际长度为320位
  @Column({ length: 512 })
  email: string;

  @Column( { length: 6 })
  emailToken: string;

  @Column()
  trytimes: number;

  @Column({ type: 'bigint' })
  createtime: number;
}