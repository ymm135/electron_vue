import service from '@/utils/request'

/* *
 *
 * 路由
 *
 * */
// 列表
export const getRouterConfigList = (data) => {
  return service({
    url: '/v1/netManage/routeConfig/pageQuery',
    method: 'post',
    data
  })
}

// 新增
export const addRouterConfig = (data) => {
  return service({
    url: '/v1/netManage/routeConfig/add',
    method: 'post',
    data
  })
}

// 编辑
export const updateRouterConfig = (data) => {
  return service({
    url: '/v1/netManage/routeConfig/update',
    method: 'put',
    data
  })
}

// 删除
export const deleteRouterConfig = (data) => {
  return service({
    url: '/v1/netManage/routeConfig/delete',
    method: 'delete',
    data
  })
}

// 一键启用
export const changeRouterConfigStatus = () => {
  return service({
    url: '/v1/netManage/routeConfig/oneClickEnable',
    method: 'get'
  })
}

/* *
 *
 * NAT
 *
 * */
// 列表
export const getNatList = (data) => {
  return service({
    url: '/v1/netManage/nat/pageQuery',
    method: 'post',
    data
  })
}

// 所有列表
export const getNatAllList = (data) => {
  return service({
    url: '/v1/netManage/nat/listQuery',
    method: 'post',
    data
  })
}

// 新增
export const addNat = (data) => {
  return service({
    url: '/v1/netManage/nat/add',
    method: 'post',
    data
  })
}

// 查询详情
export const getNatDetail = (data) => {
  return service({
    url: '/v1/netManage/nat/detailQuery?natId=' + data,
    method: 'get'
  })
}

// 更新
export const updateNat = (data) => {
  return service({
    url: '/v1/netManage/nat/update',
    method: 'put',
    data
  })
}

// 启用、禁用
export const changeNatStatus = (data) => {
  return service({
    url: '/v1/netManage/nat/statusChange',
    method: 'put',
    data
  })
}

// 删除
export const deleteNat = (data) => {
  return service({
    url: '/v1/netManage/nat/delete',
    method: 'delete',
    data
  })
}

// 移动优先级
export const moveNatPriority = (data) => {
  return service({
    url: '/v1/netManage/nat/priorityMove',
    method: 'put',
    data
  })
}

/* *
 *
 * 接口配置
 *
 * */
// 获取管理口配置信息
export const getManageInterfaceConfig = () => {
  return service({
    url: '/v1/netManage/interfaceConfig/manage/configQuery',
    method: 'get'
  })
}

// 修改管理口权限
export const updateManageInterfaceConfig = (data) => {
  return service({
    url: '/v1/netManage/interfaceConfig/manage/configModify',
    method: 'put',
    data
  })
}

// 管理口列表
export const getManageInterfaceConfigList = (data) => {
  return service({
    url: '/v1/netManage/interfaceConfig/manage/pageQuery',
    method: 'post',
    data
  })
}

// 添加管理口
export const addManageInterfaceConfig = (data) => {
  return service({
    url: '/v1/netManage/interfaceConfig/manage/add',
    method: 'post',
    data
  })
}

// 编辑管理口
export const editManageInterfaceConfig = (data) => {
  return service({
    url: '/v1/netManage/interfaceConfig/manage/update',
    method: 'put',
    data
  })
}

// 删除管理口
export const deleteManageInterfaceConfig = (data) => {
  return service({
    url: '/v1/netManage/interfaceConfig/manage/delete',
    method: 'delete',
    data
  })
}

// 业务口列表
export const getBusinessInterfaceConfigList = (data) => {
  return service({
    url: '/v1/netManage/interfaceConfig/business/pageQuery',
    method: 'post',
    data
  })
}

// 业务口详情
export const getBusinessInterfaceConfigDetail = (data) => {
  return service({
    url: '/v1/netManage/interfaceConfig/manage/detailQuery?outInterface=' + data,
    method: 'get'
  })
}

// 业务口编辑
export const updateBusinessInterfaceConfig = (data) => {
  return service({
    url: '/v1/netManage/interfaceConfig/manage/update',
    method: 'put',
    data
  })
}

// 获取网卡下拉列表
export const getEthList = () => {
  return service({
    url: '/v1/resourceObj/safeZone/networkInterface/listQuery',
    method: 'get'
  })
}
