export const RES = {
  SUCCESS: {
    code: 20000,
    msg: 'success',
    cmsg: '成功！'
  },
  // redirect
  REDIRECT: {
    code: 30000,
    msg: 'redirect',
    cmsg: '重定向'
  },
  REDIRECT_AUTH_LOGIN: {
    code: 30011,
    msg: 'redirect',
    cmsg: '登陆成功，需要重定向'
  },
  // url
  REDIRECT_URL: {
    code: 30050,
    msg: 'redirect get url',
    cmsg: '重定向URL'
  },
  // error
  CERROR: {
    code: 40000,
    msg: 'client error',
    cmsg: '客户端错误'
  },
  CERROR_PARAM: {
    code: 41000,
    msg: 'client params error',
    cmsg: '客户端参数错误'
  },
  CERROR_PARAM_TYPE: {
    code: 41001,
    msg: 'client params type error',
    cmsg: '客户端参数类型错误'
  },
  CERROR_PARAM_SIZE: {
    code: 41002,
    msg: 'client params size error',
    cmsg: '客户端参数大小错误'
  },
  // auth
  CERROR_INIT_ROOT: {
    code: 40001,
    msg: 'set root error',
    cmsg: '设置超级用户失败'
  },
  CERROR_ROOT_EXIST: {
    code: 40002,
    msg: 'root exists',
    cmsg: '超级用户不存在'
  },
  CERROR_AUTH_LOGIN: {
    code: 40010,
    msg: 'login error',
    cmsg: '登陆失败'
  },
  CERROR_AUTH_FORBIDDEN: {
    code: 40011,
    msg: 'client auth forbidden',
    cmsg: '权限不足'
  },
  CERROR_AUTH_NOT_VIP: {
    code: 40012,
    msg: 'client not vip',
    cmsg: '非VIP用户'
  },
  CERROR_AUTH_OPCODE: {
    code: 40013,
    msg: 'opcode error',
    cmsg: '操作码错误'
  },
  CERROR_AUTH_LOGOUT: {
    code: 40014,
    msg: 'logout failed',
    cmsg: '注销失败'
  },
  CERROR_AUTH_REGISTER: {
    code: 40015,
    msg: 'user register failed',
    cmsg: '注册失败'
  },
  CERROR_AUTH_PASSWORD: {
    code: 40016,
    msg: 'user password set failed',
    cmsg: '密码重置失败'
  },
  // user
  CERROR_USER_UPDATE: {
    code: 40021,
    msg: 'user update failed',
    cmsg: '用户信息更新失败'
  },
  CERROR_USER_PASSWORD_UPDATE: {
    code: 40022,
    msg: 'user password update failed',
    cmsg: '密码更新失败'
  },
  CERROR_USER_OPCODE_UPDATE: {
    code: 40023,
    msg: 'user opcode update failed',
    cmsg: '操作码更新失败'
  },
  CERROR_USER_SEARCCH: {
    code: 40024,
    msg: 'user search failed',
    cmsg: '用户搜索失败'
  },
  CERROR_USER_DETAIL: {
    code: 40025,
    msg: 'user detail get failed',
    cmsg: '用户信息获取失败'
  },
  // card
  CERROR_CARD_NOT_FOUND: {
    code: 40030,
    msg: 'card not found',
    cmsg: '卡号未找到'
  },
  CERROR_CARD_GENERAATE: {
    code: 40031,
    msg: 'card generate error',
    cmsg: '卡号生成失败'
  },
  CERROR_CARD_UPDATE: {
    code: 40031,
    msg: 'card update error',
    cmsg: '卡号更新失败'
  },
  CERROR_CARD_EXPORTED: {
    code: 40031,
    msg: 'card set exported error',
    cmsg: '卡号设置为导出失败'
  },
  CERROR_CARD_SEARCH: {
    code: 40031,
    msg: 'card search error',
    cmsg: '卡号搜索失败'
  },
  // url
  CERROR_URL_NOT_FOUND: {
    code: 40050,
    msg: 'url not found',
    cmsg: 'URL未找到'
  },
  CERROR_URL_TMP_NOT_FOUND: {
    code: 40051,
    msg: 'urltmp not found',
    cmsg: '公版URL未找到'
  },
  CERROR_URL_SEARCH: {
    code: 40052,
    msg: 'url search failed',
    cmsg: 'URL搜索失败'
  },
  CERROR_URL_UPDATETIME: {
    code: 40053,
    msg: 'url get updatetime failed',
    cmsg: 'URL获取更新时间失败'
  },
  CERROR_URL_DETAIL: {
    code: 40054,
    msg: 'url get detail failed',
    cmsg: '获取URL信息失败'
  },
  CERROR_URL_PUBLISH: {
    code: 40055,
    msg: 'url published failed',
    cmsg: 'URL发布失败'
  },
  CERROR_URL_TMP_GENERATE: {
    code: 40056,
    msg: 'urltmp generate failed',
    cmsg: 'URL模板生成失败'
  },
  CERROR_URL_TMP_COPY: {
    code: 40057,
    msg: 'urltmp copy failed',
    cmsg: 'URL模板复制失败'
  },
  CERROR_URL_TMP_UPDATE: {
    code: 40058,
    msg: 'urltmp update failed',
    cmsg: 'URL模板更新失败'
  },
  CERROR_URL_UPDATE: {
    code: 40059,
    msg: 'url update failed',
    cmsg: 'URL更新失败'
  },
  CERROR_URL_TMP_DELETE: {
    code: 40059,
    msg: 'urltmp delete failed',
    cmsg: 'URL模板删除失败'
  },
  // email token
  CERROR_EMAIL_SENT: {
    code: 40060,
    msg: 'email sent failed',
    cmsg: '邮箱发送失败'
  },
  CERROR_EMAIL_SEARCH: {
    code: 40061,
    msg: 'email search failed',
    cmsg: '邮箱信息搜索失败'
  },
  // email tran
  CERROR_EMAIL_TRAN_CREATE: {
    code: 40070,
    msg: 'email tran create failed',
    cmsg: 'email tran 创建失败，请检查name值是否唯一，该值不能重复'
  },
  CERROR_EMAIL_TRAN_SEARCH: {
    code: 40071,
    msg: 'email tran search failed',
    cmsg: 'email tran 搜索失败'
  },
  CERROR_EMAIL_TRAN_ACTIVE: {
    code: 40071,
    msg: 'email tran active failed',
    cmsg: 'email tran 激活失败'
  },
  CERROR_EMAIL_TRAN_INACTIVE: {
    code: 40071,
    msg: 'email tran inactive failed',
    cmsg: 'email tran inactive 失败'
  },
};
/*
auth 1
user 2
email 6
card 3
pay 4
url 5
*/