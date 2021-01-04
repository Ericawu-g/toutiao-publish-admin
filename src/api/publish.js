/*
发布文章相关请求模块
*/

import request from '@/utils/request'

// 发布文章
export const publishArticles = (data, draft = false) => {
  return request({
    method: 'POST',
    url: 'mp/v1_0/articles',
    params: {
      draft // 是否存为草稿（true为草稿）
    },
    data
  })
}
