import { logout, getInfo, refreshtoken, reloadSystem, shutdownSystem} from '@/api/user'
import { usbLogin } from '@/api/login'
import { getToken, setToken, getTime, removeToken, setUsername, getUsername, getAdmin, setAdmin, getSystem, setSystem, setPassword, getPassword, getPrompt, setPrompt } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import storage from '@/utils/storage'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  permissions: [],
  permisaction: [],
  licenseType: 0,
  expireType: 0,
  admin: getAdmin(),
  system: getSystem(),
  remind: false,
  username: getUsername(),
  password: getPassword(),
  tokenStartTime: getTime(),
  prompt: getPrompt()
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_TOKENSTARTTIME: (state, tokenStartTime) => {
    state.tokenStartTime = tokenStartTime
  },
  SET_USERNAME: (state, username) => {
    state.username = username
    // sessionStorage.setItem('username',username)
  },
  SET_PASSWORD: (state, password) => {
    state.password = password
  },
  SET_PROMPT: (state, prompt) => {
    state.prompt = prompt
    console.log(state)
  },
  SET_LICENSE: (state, licenseType) => {
    state.licenseType = licenseType
  },
  SET_EXPIRE: (state, expireType) => {
    state.expireType = expireType
  },
  SET_DATA: (state, data) => {
    state.data = data
  },
  SET_EXPIREDATE: (state, expireDate) => {
    state.expireDate = expireDate
  },
  SET_REMIND: (state, remind) => {
    state.remind = remind
  },
  SET_SN: (state, sn) => {
    state.sn = sn
  },
  SET_ADMIN: (state, admin) => {
    state.admin = admin
  },
  SET_SYSADMIN: (state, system) => {
    state.system = system
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    if (avatar.indexOf('http') !== -1) {
      state.avatar = avatar
    } else {
      // state.avatar = process.env.VUE_APP_BASE_API + avatar
    }
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSIONS: (state, permisaction) => {
    state.permisaction = permisaction
  }
}

const actions = {
  // user login
  login ({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      usbLogin(userInfo).then(response => {
        if (response.code == 1004) {
          this.$message.error(response.msg)
        }
        const { token } = response.jwt
        const { licenseType, expireType, data, expireDate, remind, sn } = response.license
        const { username, password } = userInfo
        commit('SET_TOKEN', token)
        // sessionStorage.setItem('token',token)
        commit('SET_LICENSE', licenseType)
        commit('SET_EXPIRE', expireType)
        commit('SET_DATA', data)
        commit('SET_EXPIREDATE', expireDate)
        commit('SET_REMIND', remind)
        commit('SET_SN', sn)
        commit('SET_ADMIN', response.admin)
        commit('SET_SYSADMIN', response.system)
        commit('SET_PROMPT', response.prompt)
        commit('SET_USERNAME', username)
        commit('SET_PASSWORD', password)
        // commit('SET_TOKENSTARTTIME',new Date().getTime())
        setToken(token)
        // settokenTime(tokenStartTime)
        setUsername(username)
        setPassword(password)
        setAdmin(response.admin)
        setSystem(response.system)
        setPrompt(response.prompt)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo ({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        if (!response || !response.data) {
          commit('SET_TOKEN', '')
          removeToken()
          resolve()
        }

        const { roles, name, avatar, introduction, permissions } = response.data
        // const {} = response.data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_PERMISSIONS', permissions)
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 退出系统
  LogOut ({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        sessionStorage.setItem('token', '')
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONS', [])
        // removeToken()
        storage.clear()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 重启
  ReloadSystem ({ commit, state }) {
    return new Promise((resolve, reject) => {
      reloadSystem(state.token).then(() => {
        commit('SET_TOKEN', '')
        sessionStorage.setItem('token', '')
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONS', [])
        // removeToken()
        storage.clear()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 关机
  ShutdownSystem ({ commit, state }) {
    return new Promise((resolve, reject) => {
      shutdownSystem(state.token).then(() => {
        commit('SET_TOKEN', '')
        sessionStorage.setItem('token', '')
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONS', [])
        // removeToken()
        storage.clear()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 刷新token
  refreshToken ({ commit, state }) {
    return new Promise((resolve, reject) => {
      refreshtoken({ token: state.token }).then(response => {
        const { token } = response
        commit('SET_TOKEN', token)
        setToken(token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken ({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles ({ commit, dispatch }, role) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
