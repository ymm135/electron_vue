import request from '@/utils/request'

// login 登陆
export function login (data) {
  return request({
    url: '/v1/login',
    method: 'post',
    data
  })
}

// logout 退出
export function logout () {
  return request({
    url: '/v1/logout',
    method: 'post'
  })
}

// reloadSystem 重启
export function reloadSystem () {
  return request({
    url: '/v1/sysSetting/reloadSystem',
    method: 'post'
  })
}

// shutdownSystem 关机
export function shutdownSystem () {
  return request({
    url: '/v1/sysSetting/shutdownSystem',
    method: 'post'
  })
}

// refreshtoken 刷新token
export function refreshtoken (data) {
  return request({
    url: '/refreshtoken',
    method: 'post',
    data
  })
}

// getInfo 获取用户基本信息
export function getInfo () {
  return request({
    url: '/v1/getinfo',
    method: 'get'
  })
}
