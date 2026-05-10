import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'
const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  baseURL,
  timeout: 10000
})
// 添加请求拦截器
instance.interceptors.request.use(function (config) {

  const userStore = useUserStore()
  if (userStore.token) {
    config.headers.Authorization = userStore.token
  }

  return config
}, function (error) {
    
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function (response) {

  if (response.data.code === 0) {
    return response
  }
  
  ElMessage.error(response.data.message || '服务异常')

  return Promise.reject(response.data)
}, function (error) {

  if (error.response?.status === 401) {
    router.push('/login')
  }
  
  ElMessage.error(error.response.data.message || '服务异常')

  return Promise.reject(error)
})

export default instance
export { baseURL }