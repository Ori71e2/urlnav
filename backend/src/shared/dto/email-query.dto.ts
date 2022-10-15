export interface EmailQueryDto {
  starttime?: number;
  endtime?: number;
  sorttype?: 'DESC' | 'ASC';
  id?: number;
  email?: string;
  emailToken?: string;
  trytimes?: number;
  createtime?: number;
}