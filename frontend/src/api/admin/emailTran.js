import request from '@/utils/request'

export function emailTranTest(info) {
  return request({
    url: '/admin/emailTran/test',
    method: 'get',
    params: info
  })
}
export function getEmailTranList(info) {
  return request({
    url: '/admin/emailTran/list',
    method: 'get',
    params: info
  })
}

export function createEmailTran(data) {
  return request({
    url: '/admin/emailTran/create',
    method: 'post',
    data
  })
}

export function saveEmailTran(data) {
  return request({
    url: '/admin/emailTran/update',
    method: 'post',
    data
  })
}

export function setEmailTranActived(data) {
  return request({
    url: '/admin/emailTran/active',
    method: 'post',
    data
  })
}

export function setEmailTranInactived(data) {
  return request({
    url: '/admin/emailTran/inactive',
    method: 'post',
    data
  })
}

export function deleteEmailTran(data) {
  return request({
    url: '/admin/emailTran/delete',
    method: 'post',
    data
  })
}
