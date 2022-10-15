import request from '@/utils/request'

export function getUrl(info) {
  if (info.opcode === undefined) {
    info.opcode = ''
  }
  return request({
    url: '/url/one/',
    method: 'get',
    params: info
  })
}
export function getUrltmpPublished() {
  return request({
    url: '/url/tmp/published',
    method: 'get'
  })
}
export function saveUrl(data) {
  return request({
    url: '/url/update',
    method: 'post',
    data
  })
}

export function getUrlUpdateTime() {
  return request({
    url: '/url/updatetime',
    method: 'get'
  })
}
