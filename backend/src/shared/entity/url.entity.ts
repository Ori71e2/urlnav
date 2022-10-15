import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'mediumtext' })
  list: string;

  @Column({ type: 'text' })
  tag: string;

  @Column({ type: 'text' })
  group_transfer: string;
  
  @Column({ type: 'text' })
  site_transfer: string;

  @Column({ length: 10240, default: '' })
  search_site: string;

  @Column({ default: false })
  active: boolean;

  // @Column({ default: '0', length: 20 })
  // updatetime: string;

  @Column({ type: 'bigint', default: 0 })
  updatetime: number;

  @Column({ type: 'bigint', default: 0 })
  createtime: number;

  @Column({ type: 'bigint', default: 0 })
  publishtime: number;

  @Column({ default: false })
  publish: boolean;

  @Column({ default: false })
  tmp: boolean;

  @Column({ unique: false })
  user_id: number;
}