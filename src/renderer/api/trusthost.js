import request from '@/utils/request'

// 获取
export function gethostList (data) {
  return request({
    url: '/v1/trustHost',
    method: 'get',
    params: data
  })
}

// 添加
export function addhostList (data) {
  return request({
    url: '/v1/trustHost',
    method: 'post',
    data
  })
}

// 编辑行信息
export function editInfo (data) {
  return request({
    url: '/v1/trustHost/' + data,
    method: 'get',
    data
  })
}

// 编辑
export function puthost (data) {
  return request({
    url: '/v1/trustHost',
    method: 'put',
    data
  })
}

export function delhost (data) {
  return request({
    url: '/v1/trustHost',
    method: 'delete',
    data
  })
}
