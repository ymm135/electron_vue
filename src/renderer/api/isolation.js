import request from '@/utils/request'

// 获取
export function getisoList (data) {
  return request({
    url: '/v1/isolation',
    method: 'get',
    params: data
  })
}

// 获取空间
export function getSize (data) {
  return request({
    url: '/v1/isolation/getUsedSize',
    method: 'get',
    params: data
  })
}

// 删除
export function delisoList (data) {
  return request({
    url: '/v1/isolation',
    method: 'delete',
    data
  })
}

// 还原
export function backisoList (data) {
  return request({
    url: '/v1/isolation',
    method: 'post',
    data
  })
}

// 下载
export function downisoList (data) {
  return request({
    url: '/v1/isolation/download',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}
