import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Porder {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ length: 16, unique: true })
  order_no: string;

  @Column({ default: '0', length: 20 })
  createtime: string;

  @Column({ length: 16 })
  total_fee: string;

  @Column()
  success: boolean;

  @Column()
  user_id: number;

  @Column({ length: 16 })
  payjs_order_id: string;

  @Column({ length: 128 })
  qrcode: string;

  @Column({ length: 64 })
  code_url: string;

  @Column({ default: '0', length: 20 })
  endtime: string;
}