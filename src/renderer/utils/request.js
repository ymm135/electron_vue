import axios from 'axios'
import router from '@/router'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, setToken } from '@/utils/auth'
import { refreshToken } from '@/api/login'

const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: '/api',
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 300000
})

service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = 'Bearer ' + getToken()
      config.headers['Content-Type'] = 'application/json'
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  async function (response) {
    if (response.config.responseType === 'blob') {
      return response
    } else {
      const code = response.data.code
      if (code === 401) {
        // store.commit('user/SET_TOKEN', '')
        const res = await refreshToken()
        // store.commit('user/SET_TOKEN', res.token)
        setToken(res.token)
        // // 再调用一次未完成的请求啊(用户无感知)
        // // error.config 就是上一次axios请求的配置对象
        // // console.dir(error.config)
        // // 把新的token赋予到下一次axios请求的请求头中
        response.config.headers['Authorization'] = 'Bearer ' + getToken()
        // debugger
        // // return到await的地方
        return service(response.config)
      } else if (code === 6401) {
      } else if (code === 400 || code === 403) {
        Message({
          message: response.data.msg,
          type: 'error',
          duration: 5 * 1000
        })
      } else if (code == 1004) {
        Message({
          message: response.data.msg,
          type: 'error'
        })
        // store.dispatch('user/resetToken')
        // location.reload()
      } else if (code === 605) {
        // Message({
        //   message: response.data.msg,
        //   type: 'error'
        // })
        return Promise.reject('modifyPassword')
      } else if (code !== 200) {
        if (response.data.msg !== '系统升级中，请稍后再试') {
          Message({
            message: response.data.msg,
            type: 'error'
          })
          // return Promise.reject('error')
          return response.data
        }
      } else {
        return response.data
      }
    }
  },
  error => {
    if (error.message === 'Network Error') {
      Message({
        message: '服务器连接异常，请检查服务器！',
        type: 'error',
        duration: 5 * 1000
      })
      return
    }
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
