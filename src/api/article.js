/*
文章相关请求模块
*/

import request from '@/utils/request'

// 获取文章列表
export const getArticle = params => {
  return request({
    method: 'GET',
    url: 'mp/v1_0/articles',
    // body参数使用data设置
    // query参数使用params设置
    // headers参数使用headers设置
    params
  })
}

// 获取文章频道
export const getArticleChannels = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/channels'
  })
}

// 删除文章
export const deleteArticle = articleId => {
  return request({
    method: 'DELETE',
    // 接口文档中的路径参数需要在url中传递
    url: `/mp/v1_0/articles/${articleId}`
  })
}
