/*
评论相关请求模块
*/

import request from '@/utils/request'

// 获取评论
export const getComments = (params, allowComment) => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/comments',
    // body参数使用data设置
    // query参数使用params设置
    // headers参数使用headers设置
    params,
    data: {
      allowComment
    }
  })
}

// 修改文章评论状态
export const updateCommentStatus = (articleId, allowComment) => {
  return request({
    method: 'PUT',
    url: '/mp/v1_0/comments/status',
    // body参数使用data设置
    // query参数使用params设置
    // headers参数使用headers设置
    params: {
      article_id: articleId
    },
    data: {
      allow_comment: allowComment
    }
  })
}
