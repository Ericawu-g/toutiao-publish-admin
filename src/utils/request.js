/**
 * 基于axios封装的请求模块
 */
import axios from 'axios'

// 创建一个axios实例
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net/' // 请求的基础路径
})

export default request
