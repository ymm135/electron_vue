import request from '@/utils/request'

// 获取
export function getdiskList (data) {
  return request({
    url: '/v1/allowDisk',
    method: 'get',
    params: data
  })
}

// 获取
export function getuser (data) {
  return request({
    url: '/v1/sysUser/resourceList',
    method: 'get',
    data
  })
}

// 授权
export function authdisk (data) {
  return request({
    url: '/v1/allowDisk',
    method: 'post',
    data
  })
}

// 取消授权
export function delauth (data) {
  return request({
    url: '/v1/allowDisk',
    method: 'delete',
    data
  })
}

// 取消查杀
export function cancelpro (data) {
  return request({
    url: '/v1/allowDisk/cancel',
    method: 'post',
    data
  })
}

// 安全U盘弹窗
export function getSafe (data) {
  return request({
    url: '/v1/upgradeUDisk',
    method: 'get',
    data
  })
}

// 安全U盘弹窗
export function uploadSafe (data) {
  return request({
    url: '/v1/upgradeUDisk',
    method: 'post',
    data
  })
}

// 轮询一
export function getStatus (data) {
  return request({
    url: '/v1/user/getStatus',
    method: 'get',
    data
  })
}

// 轮询二
export function plugStatus (data) {
  return request({
    url: '/v1/certificationCard/plugStatus',
    method: 'get',
    data
  })
}
