import request from '@/utils/request'

// 获取当前时间
export function getCurTime (data) {
  return request({
    url: '/v1/getServerTime',
    method: 'get',
    data
  })
}

// 修改时间
export function putCurTime (data) {
  return request({
    url: '/v1/setServerTime',
    method: 'put',
    data
  })
}
