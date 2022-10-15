export const RES = {
  SUCCESS: {
    code: 20000,
    msg: 'success'
  },
  // redirect
  REDIRECT: {
    code: 30000,
    msg: 'redirect'
  },
  REDIRECT_AUTH_LOGIN: {
    code: 30011,
    msg: 'redirect'
  },
  // url
  REDIRECT_URL: {
    code: 30050,
    msg: 'redirect get url'
  },
  // error
  CERROR: {
    code: 40000,
    msg: 'client error'
  },
  CERROR_PARAM: {
    code: 41000,
    msg: 'client params error'
  },
  CERROR_PARAM_TYPE: {
    code: 41001,
    msg: 'client params type error'
  },
  CERROR_PARAM_SIZE: {
    code: 41002,
    msg: 'client params size error'
  },
  // auth
  CERROR_AUTH_LOGIN: {
    code: 40010,
    msg: 'login error'
  },
  CERROR_AUTH_FORBIDDEN: {
    code: 40011,
    msg: 'client error'
  },
  CERROR_AUTH_NOT_VIP: {
    code: 40012,
    msg: 'client not vip'
  },
  CERROR_AUTH_OPCODE: {
    code: 40013,
    msg: 'opcode error'
  },
  CERROR_AUTH_LOGOUT: {
    code: 40014,
    msg: 'logout failed'
  },
  CERROR_AUTH_REGISTER: {
    code: 40015,
    msg: 'user register failed'
  },
  CERROR_AUTH_PASSWORD: {
    code: 40016,
    msg: 'user password set failed'
  },
  // user
  CERROR_USER_UPDATE: {
    code: 40021,
    msg: 'user update failed'
  },
  CERROR_USER_PASSWORD_UPDATE: {
    code: 40022,
    msg: 'user password update failed'
  },
  CERROR_USER_OPCODE_UPDATE: {
    code: 40023,
    msg: 'user opcode update failed'
  },
  CERROR_USER_SEARCCH: {
    code: 40024,
    msg: 'user search failed'
  },
  CERROR_USER_DETAIL: {
    code: 40025,
    msg: 'user detail get failed'
  },
  // card
  CERROR_CARD_NOT_FOUND: {
    code: 40030,
    msg: 'card not found'
  },
  CERROR_CARD_GENERAATE: {
    code: 40031,
    msg: 'card generate error'
  },
  CERROR_CARD_UPDATE: {
    code: 40031,
    msg: 'card update error'
  },
  CERROR_CARD_EXPORTED: {
    code: 40031,
    msg: 'card set exported error'
  },
  CERROR_CARD_SEARCH: {
    code: 40031,
    msg: 'card search error'
  },
  // url
  CERROR_URL_NOT_FOUND: {
    code: 40050,
    msg: 'url not found'
  },
  CERROR_URL_TMP_NOT_FOUND: {
    code: 40051,
    msg: 'urltmp not found'
  },
  CERROR_URL_SEARCH: {
    code: 40052,
    msg: 'url search failed'
  },
  CERROR_URL_UPDATETIME: {
    code: 40053,
    msg: 'url search failed'
  },
  CERROR_URL_DETAIL: {
    code: 40054,
    msg: 'url get detail failed'
  },
  CERROR_URL_PUBLISH: {
    code: 40055,
    msg: 'url published failed'
  },
  CERROR_URL_TMP_GENERATE: {
    code: 40056,
    msg: 'urltmp generate failed'
  },
  CERROR_URL_TMP_COPY: {
    code: 40057,
    msg: 'urltmp copy failed'
  },
  CERROR_URL_TMP_UPDATE: {
    code: 40058,
    msg: 'urltmp update failed'
  },
  CERROR_URL_UPDATE: {
    code: 40059,
    msg: 'urlt update failed'
  },
  CERROR_URL_TMP_DELETE: {
    code: 40059,
    msg: 'urlt delete failed'
  },
  // email
  CERROR_EMAIL_SENT: {
    code: 40060,
    msg: 'email sent failed'
  },
  CERROR_EMAIL_SEARCH: {
    code: 40060,
    msg: 'email search failed'
  }
}
/*
auth 1
user 2
email 6
card 3
pay 4
url 5
*/
