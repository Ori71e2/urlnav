import request from '@/utils/request'

export function setRoot(data) {
  return request({
    url: '/init/setRoot',
    method: 'post',
    data
  })
}

export function isRootSet() {
  return request({
    url: '/init/isRootSet',
    method: 'get'
  })
}
