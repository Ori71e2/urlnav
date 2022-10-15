import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/email/login',
    method: 'post',
    data
  })
}

export function isLogin() {
  return request({
    url: '/auth/email/isLogin',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/auth/email/logout',
    method: 'post'
    })
}

export function register(data) {
  return request({
    url: '/auth/email/register',
    method: 'post',
    data
  })
}
export function resetPassword(data) {
  return request({
    url: '/auth/email/resetPassword',
    method: 'post',
    data
  })
}
export function setNewPassword(data) {
  return request({
    url: '/user/setNewPassword',
    method: 'post',
    data
  })
}
export function getEmailToken(email) {
  return request({
    url: '/email/token/' + email,
    method: 'get'
  })
}

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'post',
    data: { tag: 'tag' }
  })
}

export function verify(data) {
  return request({
    url: '/card/verify',
    method: 'post',
    data
  })
}
export function setOpcode(data) {
  return request({
    url: '/user/opcode/set',
    method: 'post',
    data
  })
}
export function verifyOpcode(data) {
  return request({
    url: '/user/opcode/verify',
    method: 'post',
    data
  })
}
export function clearOpcode(data) {
  return request({
    url: '/user/opcode/clear',
    method: 'post',
    data
  })
}
