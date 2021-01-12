/*
素材相关请求模块
*/

import request from '@/utils/request'

// 上传用户图片素材
export const uploadImages = data => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/user/images',
    // body参数使用data设置
    // query参数使用params设置
    // headers参数使用headers设置
    data
  })
}

// 获取用户图片素材
export const getImages = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/images',
    // body参数使用data设置
    // query参数使用params设置
    // headers参数使用headers设置
    params
  })
}

// 收藏图片素材
export const collectImage = (imageId, collect) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/user/images/${imageId}`,
    // body参数使用data设置
    // query参数使用params设置
    // headers参数使用headers设置
    data: {
      collect
    }
  })
}

// 删除图片素材
export const deleteImage = imageId => {
  return request({
    method: 'DELETE',
    url: `/mp/v1_0/user/images/${imageId}`
  })
}
