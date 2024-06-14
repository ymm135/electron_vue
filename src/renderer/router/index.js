import Vue from 'vue'
import Router from 'vue-router'

/* Layout */
import Layout from '@/layout'

Vue.use(Router)

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  // {
  //   path: '/redirect',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: '/redirect/:path*',
  //       component: () => import('@/views/redirect/index')
  //     }
  //   ]
  // },
  // {
  //   path: '/login',
  //   component: () => import('@/views/login/index'),
  //   hidden: true
  // },
  // {
  //   path: '/',
  //   redirect: '/newlogin',
  //   meta: { title: 'USB安全隔离装置' }
  // },
  {
    path: '/Login',
    component: () => import('@/views/usblogin/index'),
    hidden: true
  },
  {
    path: '/setTimeNow',
    component: () => import('@/views/setTime/index'),
    hidden: true
  },

  // {
  //   path: '/auth-redirect',
  //   component: () => import('@/views/login/auth-redirect'),
  //   hidden: true
  // },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/ResourceLibrary',
    children: [
      // {
      //   path: 'dashboard',
      //   component: () => import('@/views/dashboard/index'),
      //   name: 'Dashboard',
      //   meta: { title: '首页', icon: 'dashboard', affix: false }
      // },
      {
        path: 'ResourceLibrary',
        component: () => import('@/views/sourceLibrary/index'),
        name: 'Source',
        meta: { title: '资源库', icon: 'Source', affix: false }
      },
      {
        path: 'BlackList',
        component: () => import('@/views/blacklist/index'),
        name: 'Blacklist',
        meta: { title: '黑名单', icon: 'blacklist', affix: false }
      },
      {
        path: 'WhiteList',
        component: () => import('@/views/whitelist/index'),
        name: 'Whitelist',
        meta: { title: '白名单', icon: 'whitelist', affix: false }
      },
      {
        path: 'Role',
        component: () => import('@/views/rolemanagement/rolemanage'),
        name: 'Rolemanage',
        meta: { title: '角色管理', icon: 'rolemanage', affix: false }
      },
      {
        path: 'SysUser',
        component: () => import('@/views/rolemanagement/usermanage'),
        name: 'Usermanage',
        meta: { title: '用户管理', icon: 'usermanage', affix: false }
      },
      {
        path: 'Isolation',
        component: () => import('@/views/isolation/index'),
        name: 'Isolation',
        meta: { title: '隔离区', icon: 'isolation', affix: false }
      },
      {
        path: 'UsbManagement',
        component: () => import('@/views/disk/index'),
        name: 'Disk',
        meta: { title: 'U盘管理', icon: 'disk', affix: false }
      },
      {
        path: 'sys-opera-log',
        component: () => import('@/views/logmanagement/logmanage'),
        name: 'Logmanage',
        meta: { title: '操作日志', icon: 'logmanage', affix: false }
      },
      {
        path: 'sysAlertLog',
        component: () => import('@/views/logmanagement/logalert'),
        name: 'Logalert',
        meta: { title: '告警日志', icon: 'logalert', affix: false }
      },
      {
        path: 'HostManagement',
        component: () => import('@/views/trusthost/index'),
        name: 'Trusthost',
        meta: { title: '主机管理', icon: 'trusthost', affix: false }
      },
      {
        path: 'basicSystem',
        component: () => import('@/views/systemSetting/basic'),
        name: 'BasicSystem',
        meta: { title: '基础设置', icon: 'basicsystem', affix: false }
      },
      {
        path: 'funcSystem',
        component: () => import('@/views/systemSetting/function'),
        name: 'FuncSystem',
        meta: { title: '功能设置', icon: 'funcSystem', affix: false }
      },
      {
        path: 'networkConfig',
        component: () => import('@/views/networkManagement/networkConfig/index.vue'),
        name: 'NetworkConfig',
        meta: { title: '网络配置', icon: 'funcSystem', affix: false }
      },
      {
        path: 'routerConfig',
        component: () => import('@/views/networkManagement/routerConfig/index.vue'),
        name: 'RouterConfig',
        meta: { title: '路由配置', icon: 'funcSystem', affix: false }
      }
    ]

  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
