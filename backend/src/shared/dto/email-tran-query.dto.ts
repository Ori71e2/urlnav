export interface EmailTranQueryDto {
  starttime?: number;
  endtime?: number;
  sorttype?: 'DESC' | 'ASC';
  name?: string;
  host?: string;
  user?: string;
  active?: boolean;
  createtime?: number;
  activetime?: number;
}