import Cookies from 'js-cookie'

const TokenKey = 'Token'
const UserKey = 'User'
const AdminKey = ''
const SystemKey = ''
const PasswordKey = ''
const PromptKey = undefined

export function getToken () {
  // return Cookies.get(TokenKey)
  return sessionStorage.getItem('token')
}

export function setToken (token) {
  // return Cookies.set(TokenKey, token)
  return sessionStorage.setItem('token', token)
}

export function getTime () {
  // return Cookies.get(TokenKey)
  return sessionStorage.getItem('tokenStartTime')
}

export function settokenTime (tokenStartTime) {
  // return Cookies.set(TokenKey, token)
  return sessionStorage.setItem('tokenStartTime', tokenStartTime)
}

export function removeToken () {
  // return Cookies.remove(TokenKey)
  return sessionStorage.setItem('token', '')
}

export function getUsername () {
  return Cookies.get(UserKey)
}

export function setUsername (username) {
  return Cookies.set(UserKey, username)
}

export function getAdmin () {
  return Cookies.get(AdminKey)
}

export function setAdmin (admin) {
  return Cookies.set(AdminKey, admin)
}

export function getSystem () {
  return Cookies.get(SystemKey)
}

export function setSystem (system) {
  return Cookies.set(SystemKey, system)
}

export function getPassword () {
  return Cookies.get(PasswordKey)
}

export function setPassword (password) {
  return Cookies.set(PasswordKey, password)
}

export function getPrompt () {
  return Cookies.get(PromptKey)
}

export function setPrompt (prompt) {
  return Cookies.set(PromptKey, prompt)
}
