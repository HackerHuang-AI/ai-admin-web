import type {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import axios from 'axios';
import {ElMessage} from 'element-plus';
import type {ApiResponse} from '@/types/api';
import i18n from '@/i18n';

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// 请求拦截器：带上 token
request.interceptors.request.use((config) => {
  config.headers['Accept-Language'] = i18n.global.locale.value
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
    if (code === '00') {
      return data as any
    }
    const errorMessage = message || i18n.global.t('request.failed')
    ElMessage.error(errorMessage)
    return Promise.reject(new Error(errorMessage))
  },
  (error: AxiosError<ApiResponse>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      window.location.href = '/login'
    } else {
      const message = error.response?.data?.message
      const fallbackKey = error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT'
        ? 'request.timeout' : error.response ? 'request.failed' : 'request.networkError'
      ElMessage.error(typeof message === 'string' && message ? message : i18n.global.t(fallbackKey))
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

