export interface UrlQueryDto {
  starttime?: number;
  endtime?: number;
  sorttype?: 'DESC' | 'ASC';
  id?: number;
  tmp?: boolean;
  list?: string;
  tag?: string;
  user_id?: number;
}