export interface CardQueryDto {
  id?: number;
  cardno?: string;
  cardpwd?: string;
  created?: boolean;
  waited?: boolean;
  exported?: boolean;
  used?: boolean;
  exportedtime?: number;
  usedtime?: string;
  createtime?: number;
  user_id?: number;
  sorttype: 'DESC' | 'ASC';
}