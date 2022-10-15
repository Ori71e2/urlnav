import request from '@/utils/request'

export function getCardList(cardInfo) {
  return request({
    url: '/admin/card/list',
    method: 'get',
    params: cardInfo
  })
}

// export function saveCards(data) {
//   return request({
//     url: '/admin/card/updateCards',
//     method: 'post',
//     data
//   })
// }
export function setCardsWaiting(data) {
  return request({
    url: '/admin/card/setWaiting',
    method: 'post',
    data
  })
}
export function setCardsExported(data) {
  return request({
    url: '/admin/card/setExported',
    method: 'post',
    data
  })
}
export function generateCardList(info) {
  return request({
    url: '/admin/card/generate',
    method: 'get',
    params: info
  })
}
