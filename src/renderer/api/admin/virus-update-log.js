import request from '@/utils/request'

// 查询VirusUpdateLog列表
export function listVirusUpdateLog (query) {
  return request({
    url: '/api/v1/virusUpdateLog',
    method: 'get',
    params: query
  })
}

// 查询VirusUpdateLog详细
export function getVirusUpdateLog (id) {
  return request({
    url: '/api/v1/virusUpdateLog/' + id,
    method: 'get'
  })
}

// 新增VirusUpdateLog
export function addVirusUpdateLog (data) {
  return request({
    url: '/api/v1/virusUpdateLog',
    method: 'post',
    data: data
  })
}

// 修改VirusUpdateLog
export function updateVirusUpdateLog (data) {
  return request({
    url: '/api/v1/virusUpdateLog',
    method: 'put',
    data: data
  })
}

// 删除VirusUpdateLog
export function delVirusUpdateLog (data) {
  return request({
    url: '/api/v1/virusUpdateLog',
    method: 'delete',
    data: data
  })
}
