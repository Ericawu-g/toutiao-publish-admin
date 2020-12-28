/**
 * 基于axios封装的请求模块
 */
import axios from 'axios'

// 创建一个axios实例
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net/' // 请求的基础路径
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  // 所有请求会经过这里
  const user = JSON.parse(window.localStorage.getItem('user'))
  // 如果有登录用户信息，则统一设置token
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // config是当前请求相关的配置信息对象
  return config
}, function (error) {
  // 请求失败，会经过这里
  return Promise.reject(error)
})

export default request
