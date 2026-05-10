import request from '@/utils/request'

export const articleGetChannelsService = () => {
  return request.get('/my/cate/list')
}

export const articleAddChannelsService = (data) => {
  return request.post('/my/cate/add', data)
}

export const articleEditChannelsService = (data) => {
  return request.put('/my/cate/info', data)
}

export const articleDelChannelsService = (id) => {
  return request.delete('/my/cate/del', {
    params: { id }
  })
}

export const articleGetListService = (params) => {
  return request.get('/my/article/list', { params })
}

export const articlePublishService = (data) => {
  return request.post('/my/article/add', data)
}

export const articleGetDetailService = (id) => {
  return request.get('/my/article/info', { params: { id } })
}

export const articleEditService = (data) => {
  return request.put('my/article/info', data)
}

export const articleDelService = (id) => {
  return request.delete('/my/article/info', { params: { id } })
}