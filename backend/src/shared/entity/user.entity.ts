import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 124 })
  name: string;

  // email实际长度为320位
  // mysql建立索引时，数据库计算key的长度是累加所有index用到的字段的char长度，在按照下面的比例乘起来
  // 不能超过限定的key长度767：
  // latin1 = 1 byte = 1 character
  // uft8 = 3 byte = 1 character
  // utf8mb4 = 4byte = 1character
  // gbk = 2 byte = 1 character
  @Column({ length: 128, unique: true })
  email: string;

  @Column({ length: 2048 })
  password: string;

  @Column({ length: 2048, default: '' })
  opcode: string;

  @Column({ default: 0 })
  role: number;

  @Column({ type: 'bigint', default: 0 })
  vip_expiretime: number;

  @Column({ type: 'bigint', default: 0 })
  createtime: number;

  @Column({ default: false })
  active: boolean;

}