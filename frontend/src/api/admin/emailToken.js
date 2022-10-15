import request from '@/utils/request'

export function getEmailTokenList(info) {
  return request({
    url: '/admin/emailToken/list',
    method: 'get',
    params: info
  })
}

export function saveUser(data) {
  return request({
    url: '/admin/user/update',
    method: 'post',
    data
  })
}
