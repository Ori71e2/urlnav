// success: true => message, data
// success: false => errorMessage, error

export interface IResponse{
  code: number;
  message: string;
  data: any[];
  error: any;
}