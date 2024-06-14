import request from '@/utils/request'

// 获取
export function getwhiteList (data) {
  return request({
    url: '/v1/whitelist',
    method: 'get',
    params: data
  })
}

export function delwhiteList (data) {
  return request({
    url: '/v1/whitelist/deleteById',
    method: 'delete',
    data
  })
}

// 清空
export function delAll (data) {
  return request({
    url: '/v1/whitelist/deleteByType',
    method: 'delete',
    data
  })
}

// 增加-上传
export function uploadWhite (data) {
  return request({
    url: '/v1/whitelist/upload',
    method: 'post',
    data
  })
}
