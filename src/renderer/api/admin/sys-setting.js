import request from '@/utils/request'

// 查询SysSetting列表
export function listSysSetting (query) {
  return request({
    url: '/api/v1/sysSetting',
    method: 'get',
    params: query
  })
}

// 查询SysSetting详细
export function getSysSetting (id) {
  return request({
    url: '/api/v1/sysSetting/' + id,
    method: 'get'
  })
}

// 新增SysSetting
export function addSysSetting (data) {
  return request({
    url: '/api/v1/sysSetting',
    method: 'post',
    data: data
  })
}

// 修改SysSetting
export function updateSysSetting (data) {
  return request({
    url: '/api/v1/sysSetting',
    method: 'put',
    data: data
  })
}

// 删除SysSetting
export function delSysSetting (data) {
  return request({
    url: '/api/v1/sysSetting',
    method: 'delete',
    data: data
  })
}
