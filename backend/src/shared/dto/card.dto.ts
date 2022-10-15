export interface CardDto {
  id?: number;
  cardno?: string;
  cardpwd?: string;
  exported?: boolean;
  used?: boolean;
  exportedtime?: number;
  usedtime?: number;
  trytimes?: number;
  createtime?: number;
  user_id?: number;
}