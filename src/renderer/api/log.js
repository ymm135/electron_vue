import request from '@/utils/request'

// 获取
export function getlogList (data) {
  return request({
    url: '/v1/sys-opera-log',
    method: 'get',
    params: data
  })
}

// 用户名下拉框
export function getUserList (data) {
  return request({
    url: '/v1/sysUser/list',
    method: 'get',
    data
  })
}

// ip下拉框
export function getipList (data) {
  return request({
    url: '/v1/sys-opera-log/operaIpList',
    method: 'get',
    data
  })
}

// 模块下拉框
export function gettitleList (data) {
  return request({
    url: '/v1/dict-data/option-select',
    method: 'get',
    params: data
  })
}

// 获取告警日志
export function getalertList (data) {
  return request({
    url: '/v1/sysAlertLog',
    method: 'get',
    params: data
  })
}

// 导出操作日志
export function downlog (data) {
  return request({
    url: '/v1/sys-opera-log/export',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 导出告警日志
export function downlogalert (data) {
  return request({
    url: '/v1/sysAlertLog/export',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}
