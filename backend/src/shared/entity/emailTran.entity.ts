import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EmailTran {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 128 })
  name: string;

  // 由多个标号组成的完整域名总共不超过255个字符。
  @Column({ length: 255 })
  host: string;

  @Column()
  port: number;

  // user为email格式，email实际长度为320位
  // email实际长度为320位
  // mysql建立索引时，数据库计算key的长度是累加所有index用到的字段的char长度，在按照下面的比例乘起来
  // 不能超过限定的key长度767：
  // latin1 = 1 byte = 1 character
  // uft8 = 3 byte = 1 character
  // utf8mb4 = 4byte = 1character
  // gbk = 2 byte = 1 character
  @Column({ length: 128 })
  user: string;

  @Column({ length: 128 })
  pass: string;

  @Column({ type: 'bigint' })
  createtime: number;

  @Column({ type: 'bigint', default: 0 })
  activetime: number;

  @Column()
  active: boolean;
}