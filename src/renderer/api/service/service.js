import request from '@/utils/request'

// 查询文件列表
export function findListByRole (query) {
  return request({
    url: '/api/v1/findListByRole',
    method: 'get',
    params: query
  })
}

// 删除文件
export function deleteFile (query) {
  return request({
    url: '/api/v1/deleteFile',
    method: 'get',
    params: query
  })
}

// 文件下载
export function downloadFile (query) {
  return request({
    url: '/api/v1/downloadFile',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

// 文件下载上传
export function uploadFile (data) {
  return request({
    url: '/api/v1/uploadFile',
    method: 'post',
    data: data
  })
}
