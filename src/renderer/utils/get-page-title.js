import storage from '@/utils/storage'

export default function getPageTitle (pageTitle) {
  const app_info = storage.get('app_info')
  // const title = app_info ? app_info.sys_app_name : 'USB安全隔离装置'
  const title = 'USB安全隔离装置'
  // if (pageTitle) {
  //   return `${pageTitle} - ${title}`
  // }
  return `${title}`
}
