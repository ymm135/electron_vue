import request from '@/utils/request'

// 获取角色列表
export function getroleList (data) {
  return request({
    url: '/v1/role',
    method: 'get',
    params: data
  })
}

// 删除角色
export function delrole (data) {
  return request({
    url: '/v1/role',
    method: 'delete',
    data
  })
}

// 新增角色
export function addrole (data) {
  return request({
    url: '/v1/role',
    method: 'post',
    data
  })
}

// 编辑角色
export function editrole (data) {
  return request({
    url: '/v1/role',
    method: 'put',
    data
  })
}

// 获取下拉列表
export function addroleList () {
  return request({
    url: '/v1/role/list',
    method: 'get'
  })
}

// 获取用户列表
export function getuserList (data) {
  return request({
    url: '/v1/sysUser',
    method: 'get',
    params: data
  })
}

// 编辑用户
export function getdetail (data) {
  return request({
    url: '/v1/sysUser/' + data.userId,
    method: 'get',
    data
  })
}

// 编辑用户
export function edituser (data) {
  return request({
    url: '/v1/sysUser',
    method: 'put',
    data
  })
}

// 删除用户列表
export function deluser (data) {
  return request({
    url: '/v1/sysUser',
    method: 'delete',
    data
  })
}

// 新增用户
export function adduser (data) {
  return request({
    url: '/v1/sysUser',
    method: 'post',
    data
  })
}

// 修改状态
export function editstatus (data) {
  return request({
    url: '/v1/user/status',
    method: 'put',
    data
  })
}

// 修改密码
export function editpassword (data) {
  return request({
    url: '/v1/user/pwd/set',
    method: 'put',
    data
  })
}
