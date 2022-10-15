// success: true => message, data
// success: false => errorMessage, error
import { IResponse } from '../interfaces/response.interface';

// export class ResponseError implements IResponse{
//   constructor (code: number, infoMessage:string, data?: any) {
//     this.code = code;
//     this.message = infoMessage;
//     this.data = data;
//     // console.warn(new Date().toString() + ' - [Response]: ' + infoMessage + (data ? ' - ' + JSON.stringify(data): ''));
//   };
//   message: string;
//   data: any[];
//   error: any;
//   code: number;
// }

// export class ResponseSuccess implements IResponse{
//   constructor (infoMessage:string, data?: any, notLog?: boolean) {
//     this.code = 20000;
//     this.message = infoMessage;
//     this.data = data;
//     if(!notLog) {
//       try {
//         var offuscateRequest = JSON.parse(JSON.stringify(data));
//         if(offuscateRequest && offuscateRequest.token) offuscateRequest.token = "*******";
//       } catch(error){}
//     };
//   };
//   message: string;
//   data: any[];
//   error: any;
//   code: number;
// }

export class CResponse implements IResponse{
  constructor (res: { code: number, msg: string, cmsg: string }, data?: any) {
    this.code = res.code;
    this.message = res.msg;
    this.cmessage = res.cmsg;
    this.data = data;
    const env = process.env.NODE_ENV || 'production';
    if (env === 'development') {
      if ([4, 5].indexOf(Math.floor(res.code / 10000)) !== -1) {
        this.error = data
      }
    } else {
      if ([4, 5].indexOf(Math.floor(res.code / 10000)) !== -1) {
        delete this.data
      }
    }
    // console.warn(new Date().toString() + ' - [Response]: ' + infoMessage + (data ? ' - ' + JSON.stringify(data): ''));
  };
  message: string;
  cmessage: string;
  data: any[];
  error: any;
  code: number;
}