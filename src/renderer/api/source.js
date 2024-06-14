import request from '@/utils/request'
import { getToken } from '@/utils/auth'

// 获取左侧列表
export function getleftList (data) {
  return request({
    url: '/v1/resourceLibrary',
    method: 'get',
    params: data
  })
}

// 获取剩余空间
export function getfreesize (data) {
  return request({
    url: '/v1/resourceLibrary/getFreeSize',
    method: 'get',
    data
  })
}

// 删除
export function delList (data) {
  return request({
    url: '/v1/resourceLibrary/remove',
    method: 'post',
    data
  })
}

// 复制
export function copyList (data) {
  return request({
    url: '/v1/resourceLibrary/copy',
    method: 'post',
    data
  })
}

// 移动
export function moveList (data) {
  return request({
    url: '/v1/resourceLibrary/move',
    method: 'post',
    data
  })
}

// 重命名
export function renameList (data) {
  return request({
    url: '/v1/resourceLibrary/rename',
    method: 'post',
    data
  })
}

// 新建文件夹
export function addList (data) {
  return request({
    url: '/v1/resourceLibrary/mkdir',
    method: 'post',
    data
  })
}

// 上传前判断
export function ifuploadList (data) {
  return request({
    url: '/v1/resourceLibrary/uploadFileName',
    method: 'post',
    data
  })
}
// 上传
export function uploadList (data) {
  return request({
    url: '/v1/resourceLibrary/uploadFiles',
    method: 'post',
    data
  })
}

// 下载
export function ifdownList (data) {
  return request({
    url: '/v1/resourceLibrary/getDownloadPath',
    method: 'post',
    data
  })
}
export function downList (data) {
  return request({
    url: '/v1/resourceLibrary/download',
    method: 'post',
    responseType: 'blob',
    params: data
  })
}

// 获取用户权限
export function getAccess (data) {
  return request({
    url: '/v1/globalInfo',
    method: 'get',
    data
  })
}

// 预览-解密
export function previewAll (data) {
  return request({
    url: '/v1/resourceLibrary/getDownloadPath',
    method: 'post',
    data
  })
}

// 预览
export function previewDetail (data) {
  return request({
    url: '/v1/resourceLibrary/download',
    method: 'post',
    params: data
  })
}

// 预览转成pdf
export function previewDoc (data) {
  return request({
    url: '/v1/resourceLibrary/convertPdf',
    method: 'post',
    responseType: 'blob',
    params: data
  })
}

// 预览txt
export function previewTxt (data) {
  return request({
    url: '/v1/resourceLibrary/txtPreview',
    method: 'post',
    responseType: 'blob',
    params: data
  })
}
