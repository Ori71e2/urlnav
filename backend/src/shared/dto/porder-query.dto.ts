export class PorderQueryDto {
  starttime: number;
  endtime: number;
  id: number;
  order_no: string;
  payjs_order_id: string;
  user_id: string;
  success: boolean;
  sorttype: 'DESC' | 'ASC';
}