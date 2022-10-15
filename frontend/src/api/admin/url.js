import request from '@/utils/request'

export function getUrlList(info) {
  return request({
    url: '/admin/url/list',
    method: 'get',
    params: info
  })
}

export function setUrlTmpPusblish(data) {
  return request({
    url: '/admin/url/publish',
    method: 'post',
    data
  })
}

export function createUrlTmp() {
  return request({
    url: '/admin/url/create',
    method: 'get'
  })
}

export function copyUrlTmp(data) {
  return request({
    url: '/admin/url/copy',
    method: 'post',
    data
  })
}

export function removeUrlTmp(info) {
  return request({
    url: '/admin/url/delete',
    method: 'delete',
    params: info
  })
}

export function saveUrlTmp(data) {
  return request({
    url: '/admin/url/urltmpupdate',
    method: 'post',
    data
  })
}
export function saveUrl(data) {
  return request({
    url: '/admin/url/update',
    method: 'post',
    data
  })
}

export function getUrlTmpUpdatetime(params) {
  return request({
    url: '/admin/url/updatetime',
    method: 'get',
    params
  })
}

export function getUrldetail(params) {
  return request({
    url: '/admin/url/detail',
    method: 'get',
    params
  })
}
export function getUrlTmpdetail(params) {
  return request({
    url: '/admin/url/detail',
    method: 'get',
    params
  })
}
