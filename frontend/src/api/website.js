import request from '@/utils/request'

export function getWebsiteList(data) {
  return request({
    url: '/website/list',
    method: 'get',
    params: data
  })
}

// export function saveCards(data) {
//   return request({
//     url: '/website/updateCards',
//     method: 'post',
//     data
//   })
// }
export function setCardsWaiting(data) {
  return request({
    url: '/website/setWaiting',
    method: 'post',
    data
  })
}
export function setCardsExported(data) {
  return request({
    url: '/website/setExported',
    method: 'post',
    data
  })
}
export function generateCardList(info) {
  return request({
    url: '/website/generate',
    method: 'get',
    params: info
  })
}
