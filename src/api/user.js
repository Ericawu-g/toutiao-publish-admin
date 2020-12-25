/*
用户相关请求模块
*/

import request from '@/utils/request'
// 用户登录
export const login = data => {
  return request({
    method: 'POST',
    url: 'mp/v1_0/authorizations',
    // data用来设置post请求体
    data
  })
}

// 获取用户信息
export const getUserProfile = () => {
  return request({
    method: 'GET',
    url: 'mp/v1_0/user/profile',
    // 后端要求把需要授权的用户身份放到请求头中
    // axios可以通过headers选项设置请求头
    headers: {
      // 属性名和属性值都得看接口的要求
      // 属性名：Authorization，接口要求的
      // 属性值： Bearer空格token数据
      Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDAzMzA0NDksInVzZXJfaWQiOjEsInJlZnJlc2giOmZhbHNlLCJ2ZXJpZmllZCI6dHJ1ZX0.xvzACL7kbPdN0EJwIR8mDk3NV55RHZXxd2NUjEdWAdU'
    }
  })
}

// 修改用户信息
// export const updateUser = () => {

// }