import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import type { ApiResponse } from '@/types/api';

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// 请求拦截器：带上 token
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器：统一处理错误
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, message, data } = response.data
    if (code === 0) {
      return data as any
    }
    ElMessage.error(message || '请求失败')
    return Promise.reject(new Error(message))
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    } else {
      ElMessage.error(error.message || '网络错误')
    }
    return Promise.reject(error)
  }
)

export function get<T>(url: string, params?: object, config?: AxiosRequestConfig): Promise<T> {
  return request.get(url, { params, ...config })
}

export function post<T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
  return request.post(url, data, config)
}

export default request

