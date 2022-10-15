export interface UrltmpQueryDto {
  starttime?: string;
  endtime?: string;
  sorttype?: 'DESC' | 'ASC';
  id?: number;
  list?: string;
  tag?: string;
  group_transfer?: string;
  site_transfer?: string;
  search_site?: string;
  mark?: string;
  publish?: boolean;
  publishtime?: number;
  updatetime?: number;
  createtime?: number;
}