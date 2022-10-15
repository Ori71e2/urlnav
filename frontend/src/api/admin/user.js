import request from '@/utils/request'

export function getUserList(info) {
  return request({
    url: '/admin/user/list',
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

export function getUserDetail(info) {
  return request({
    url: '/admin/user/detail',
    method: 'get',
    params: info
  })
}
