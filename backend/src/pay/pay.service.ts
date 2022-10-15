import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
let request = require('superagent');
import { Md5 } from 'ts-md5';
import { default as config } from '../config'
import { QRcodeDto } from 'src/shared/dto/qrcode.dto';
import { Porder, User } from '../shared/entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import stringRandom = require('string-random');
import { ROLE } from '../shared/common/constrant';
import { IPaginationOptions, Pagination, paginate } from '../lib/nestjs-typeorm-paginate';
import { PorderQueryDto } from '../shared/dto/porder-query.dto';

let urlnative   = 'https://payjs.cn/api/native';
let urlmicropay = 'https://payjs.cn/api/micropay';
let urlcashier  = 'https://payjs.cn/api/cashier';
let urljsapi    = 'https://payjs.cn/api/jsapi'
let urlfacepay  = 'https://payjs.cn/api/facepay';
let urlcheck    = 'https://payjs.cn/api/check';
let urlclose    = 'https://payjs.cn/api/close';
let urlreverse  = 'https://payjs.cn/api/reverse';
let urlrefund   = 'https://payjs.cn/api/refund';
let urlopenid   = 'https://payjs.cn/api/openid';
let urluser     = 'https://payjs.cn/api/user';
let urlinfo     = 'https://payjs.cn/api/info';
let urlbank     = 'https://payjs.cn/api/bank';

let key = config.payjs.key;
let mchid = config.payjs.mchid;
let host = config.host.url;
let port = config.host.port;

@Injectable()
export class PayService {
  // key: string = config.payjs.key;
  // mchid: string = config.payjs.mchid;
  
  constructor(
    @InjectRepository(Porder) private readonly porderRepository: Repository<Porder>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {

  }
  async paginate(options: IPaginationOptions): Promise<Pagination<Porder>> {
    const queryBuilder = this.porderRepository.createQueryBuilder('porder').orderBy('porder.timestamp', 'DESC');
    return await paginate<Porder>(queryBuilder, options);
  }
  async paginateQuery(
    options: IPaginationOptions,
    queryOptions: PorderQueryDto,
    ): Promise<Pagination<Porder>> {
    let { starttime, endtime, id, order_no, payjs_order_id, user_id, sorttype, success } = queryOptions;
    if (['DESC', 'ASC'].indexOf(sorttype) === -1) {
      sorttype = 'DESC';
    }
    const queryBuilder = this.porderRepository.createQueryBuilder('porder')

    if (starttime !== undefined) { queryBuilder.where('porder.createtime >= :starttime', { starttime }) }
    if (endtime !== undefined) { queryBuilder.andWhere('porder.createtime <= :endtime', { endtime }) }
    if (id !== undefined) { queryBuilder.andWhere('porder.id = :id', { id }) }
    if (order_no !== undefined) { queryBuilder.andWhere('porder.order_no = :order_no', { order_no }) }
    if (payjs_order_id !== undefined) { queryBuilder.andWhere('porder.payjs_order_id = :payjs_order_id', { payjs_order_id }) }
    if (user_id !== undefined) { queryBuilder.andWhere('porder.user_id = :user_id', { user_id }) }
    if (success !== undefined) { queryBuilder.andWhere('porder.success = :success', { success }) }

    // if (like !== '') { queryBuilder.andWhere('porder.describe LIKE :like', { like: '%'+like+'%' }) }
    queryBuilder.orderBy('porder.createtime', sorttype)
    return await paginate<Porder>(queryBuilder, options);
  }
  async getOrderByOrderNo(order_no): Promise<Porder> {
    let porder = await this.porderRepository.findOneOrFail({ order_no });
    return porder;
  }
  async getOrderByUserId(user_id): Promise<Porder[]> {
    let porder = await this.porderRepository.find({ user_id });
    return porder;
  }
  async geneteQrcode(user_id: number): Promise<QRcodeDto>{
    let order_no: string;

    do {
      order_no = this.generateOrderNo(user_id);
    } while(!this.porderRepository.findOneOrFail({ order_no }))

    let time = new Date().getTime().toString();

    let porder = this.porderRepository.create();
    porder.order_no = order_no;
    porder.createtime = time;
    porder.success = false;
    porder.total_fee = '' + 18.88;
    porder.user_id = user_id;
    if (!await this.porderRepository.save(porder)) {
      throw new HttpException('PAY.DATABASE_ERROR', HttpStatus.FORBIDDEN);
    }
    let params = 
    {
      'mchid': mchid,     //商户号
      'total_fee': 18.88,              //金额。单位：分
      'out_trade_no': order_no, //用户端自主生成的订单号
      'body': 'VIP会员开通',           //订单标题
      'attach': '',       //用户自定义数据，在notify的时候会原样返回
      'notify_url': host + ':' + port + '/pay/notify' //接收微信支付异步通知的回调地址。必须为可直接访问的URL，不能带参数、session验证、csrf验证。留空则不通知
    };
    let native = async () => {
      return new Promise((resolve, reject) => {
        this.native(params, (res: any) => {
          let data = res.data;
          let success = res.success;
          if(success && data.return_code) {
            resolve(data);
          } else {
            reject(false);
          }
        })
      })
    }

    let data: any = await native()
    if(data && data.return_code) {
      porder.payjs_order_id = data.payjs_order_id;
      porder.qrcode = data.qrcode;
      porder.code_url = data.code_url;
      if (!await this.porderRepository.save(porder)) {
        throw new HttpException('PAY.DATABASE_ERROR', HttpStatus.FORBIDDEN);
      }
      return { 'qrcode': data.qrcode, 'code_url': data.code_url}
    } else {
      throw new HttpException('PAY.PAY_ERROR', HttpStatus.FORBIDDEN);
    }
  }

  generateOrderNo(user_id: number): string {
    let time = new Date().getTime().toString();
    let id = '' + user_id;
    let random = '' + stringRandom(6, { numbers: true, letters: false });
    let order_no: string = time;
    for (let i=0; i<11-id.length; i++) {
      order_no += '0';
    }
    order_no += id;
    order_no += '00' + random;
    return order_no;
  }

  async notify(params: any): Promise<boolean> {
    if(this.notifyCheck(params)) {
      let porder = await this.porderRepository.findOneOrFail({ order_no: params.order_no });
      let user = await this.userRepository.findOneOrFail({ id: porder.user_id })
      if (porder && user) {
        porder.success = true;
        porder.endtime = new Date().getTime().toString();
        user.role = ROLE.REGISTER;
        this.porderRepository.save(porder);
        this.userRepository.save(user);
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  toQueryString(obj) {
    return Object.keys(obj).filter(function(key) {
      return key !== 'sign' && obj[key] !== undefined && obj[key] !== '';
    }).sort().map(function(key) {
      if (/^http(s)?:\/\//.test(obj[key])) {
        return key + '=' + encodeURI(obj[key]);
      } else {
        return key + '=' + obj[key];
      }
    }).join('&');
  };
  
  md5(str: string) {
    // let encoding = arguments[1] !== (void 0) ? arguments[1] : 'utf8';
    return Md5.hashStr(str).toString().toUpperCase();
    // return crypto.createHash('md5').update(str, encoding).digest('hex');
  };
  
  
  signature(paramss: any) {
    let params = paramss;
    let strparams = this.toQueryString(params);  //签名第一步
    strparams += '&key=' + key; //签名第二步1
    const sign = this.md5(strparams).toUpperCase();//签名第二步2
    params['sign']=sign;
    return params;
  }
  
  //扫码支付（主扫）
  native(params: any, callback) {
    request.post(urlnative)
    .send(this.signature(params))
    .end((err,res) => {
      if(!err){
        callback({'success': true, 'data': res.body });
      }else{
        callback({'success': false, 'data': err });
      }
    });
  }
  
  //付款码支付（被扫）
  micropay(params: any,callback) {
    request.post(this.urlmicropay)
    .send(this.signature(params))
    .end((err,res) => {
      if(!err){
        callback(res.body);
      }else{
        callback({'return_code':0,'msg':'本地调用出错'});
      }
    });
  }
  urlmicropay(urlmicropay: any) {
    throw new Error("Method not implemented.");
  }
  
  //订单查询接口
  check(params: any,callback) {
    request.post(this.urlcheck)
    .send(this.signature(params))
    .end((err,res) => {
      if(!err){
        callback(res.body);
      }else{
        callback({'return_code':0,'msg':'本地调用出错'});
      }
    });
  }
  urlcheck(urlcheck: any) {
    throw new Error("Method not implemented.");
  }
  
  //关闭订单接口
  close(params,callback) {
    request.post(this.urlclose)
    .send(this.signature(params))
    .end((err,res) => {
      if(!err){
        callback(res.body);
      }else{
        callback({'return_code':0,'msg':'本地调用出错'});
      }
    });
  }
  urlclose(urlclose: any) {
    throw new Error("Method not implemented.");
  }
  
  //撤销订单接口
  reverse(params,callback) {
    request.post(this.urlreverse)
    .send(this.signature(params))
    .end((err,res) => {
      if(!err){
        callback(res.body);
      }else{
        callback({'return_code':0,'msg':'本地调用出错'});
      }
    });
  }
  urlreverse(urlreverse: any) {
    throw new Error("Method not implemented.");
  }
  
  //退款接口
  refund(params,callback) {
    request.post(this.urlrefund)
    .send(this.signature(params))
    .end((err,res) => {
      if(!err){
        callback(res.body);
      }else{
        callback({'return_code':0,'msg':'本地调用出错'});
      }
    });
  }
  urlrefund(urlrefund: any) {
    throw new Error("Method not implemented.");
  }
  
  
  
  //异步通知的签名校验
  notifyCheck(params) {
    let originSign = params["sign"];
    delete params["sign"];
    return this.signature(params)["sign"] == originSign;
  }
}
