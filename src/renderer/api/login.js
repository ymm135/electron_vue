import request from '@/utils/request'
import { getToken } from '@/utils/auth'

// 获取验证码
export function getCodeImg () {
  return request({
    url: '/v1/captcha',
    method: 'get'
  })
}

// 查询 此接口不在验证数据权限
export function getSetting () {
  return request({
    url: '/v1/app-config',
    method: 'get'
  })
}

// 获取谷歌身份码
export function getGoogle () {
  return request({
    url: '/v1/googleAuthenticator/status',
    method: 'get'
  })
}

// 获取用户信息
export function getInfo () {
  return request({
    url: '/v1/getinfo',
    method: 'get'
    // headers: { Authorization: 'Bearer ' + getToken() },
  })
}

// 登录
export function usbLogin (data) {
  return request({
    url: '/v1/login',
    method: 'post',
    data
  })
}

// 授权文件
export function updateAuth (data) {
  return request({
    url: '/v1/license/updateAuth',
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data
  })
}

// 刷新token
export function refreshToken () {
  return request({
    url: '/v1/refresh_token',
    method: 'get'
  })
}
