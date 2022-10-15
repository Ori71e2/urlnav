export interface UserQueryDto {
  starttime: number;
  endtime: number;
  sorttype: 'DESC' | 'ASC';
  id?: number;
  name?: string;
  email?: string;
  vip?: boolean;
  role?: string;
  active?: boolean;
}