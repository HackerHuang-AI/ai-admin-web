// 通用接口响应结构
export interface ApiResponse<T = unknown> {
  code: number | string
  message: string
  errorCode?: string
  data: T | null
  errors?: { errorCode: string; message: string }[] | null
}

// 分页参数
export interface PageParams {
  page: number
  pageSize: number
}

// 分页响应
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

