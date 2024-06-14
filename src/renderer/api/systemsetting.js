import request from '@/utils/request'

// 获取基本设置
export function getBasicInfo (data) {
  return request({
    url: '/v1/sysSetting/get',
    method: 'get',
    data
  })
}

// 导出系统日志
export function logSystem (data) {
  return request({
    url: '/v1/sysSetting/debugLogExport',
    method: 'get',
    responseType: 'blob',
    data
  })
}

// 导出配置
export function logConfig (data) {
  return request({
    url: '/v1/sysSetting/sqlExport',
    method: 'get',
    responseType: 'blob',
    data
  })
}

// 导入配置
export function uploadConfig (data) {
  return request({
    url: '/v1/sysSetting/sqlUpload',
    method: 'post',
    data
  })
}

// 回退版本
export function versionBack (data) {
  return request({
    url: '/v1/sysSetting/versionBack',
    method: 'post',
    data
  })
}

// 恢复出厂
export function recoverSet (data) {
  return request({
    url: '/v1/sysSetting/recover',
    method: 'put',
    data
  })
}

// 病毒库上传前获取信息
export function getVirusInfo (data) {
  return request({
    url: '/v1/globalInfo',
    method: 'get',
    data
  })
}

// 病毒库上传
export function uploadVirus (data) {
  return request({
    url: '/v1/uploadVirusLib',
    method: 'post',
    data
  })
}

// 升级包上传
export function uploadSys (data) {
  return request({
    url: '/v1/sysSetting/sysUpgrade',
    method: 'post',
    data
  })
}

// 保存
export function putInfo (data) {
  return request({
    url: '/v1/sysSetting',
    method: 'put',
    // contentType: "application/json",
    data
  })
}

// 保存lan
export function putLan (data) {
  return request({
    url: '/v1/sysSetting/setLanIp',
    method: 'put',
    data
  })
}

// 保存时间
export function putTime (data) {
  return request({
    url: '/v1/sysSetting/setServerTime',
    method: 'put',
    data
  })
}

// ip时间同步
export function putIpTime (data) {
  return request({
    url: '/v1/sysSetting/setNtp',
    method: 'put',
    data
  })
}

// 危险告警
export function ifDanger (data) {
  return request({
    url: '/v1/sysSetting/operationAlarm',
    method: 'post',
    data
  })
}

// 危险告警
export function putDanger (data) {
  return request({
    url: '/v1/sysSetting/operationAlarm',
    method: 'put',
    data
  })
}
