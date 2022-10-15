export interface UserDto {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  opcode?:string;
  vip?: boolean;
  role?: number;
  vip_expiretime?: number;
  active?: boolean;
}