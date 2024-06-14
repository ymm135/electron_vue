import request from '@/utils/request'

// 获取
export function getList (data) {
  return request({
    url: '/v1/blacklist',
    method: 'get',
    params: data
  })
}

export function editList (data) {
  return request({
    url: '/v1/blacklist',
    method: 'put',
    data
  })
}
export function addList (data) {
  return request({
    url: '/v1/blacklist',
    method: 'post',
    data
  })
}

export function delList (data) {
  return request({
    url: '/v1/blacklist',
    method: 'delete',
    data
  })
}

export function downList () {
  return request({
    url: '/v1/blacklist/batchInsert',
    method: 'post'
  })
}
