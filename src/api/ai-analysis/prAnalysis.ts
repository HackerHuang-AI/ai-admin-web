import { get, post } from '@/api/request';
import type { PageParams, PageResult } from '@/types/api';

export interface PrFile {
  id: number
  filename: string
  status: string
  additions: number
  deletions: number
}

export interface AiContext {
  summary: string
  riskLevel: 'low' | 'medium' | 'high'
  suggestions: string[]
}

// 获取 PR 文件列表
export function getPrFiles(prId: number, params: PageParams): Promise<PageResult<PrFile>> {
  return get(`/ai-analysis/api/prAnalysis/pulls/${prId}/files`, params)
}

// 获取文件 AI 分析上下文
export function getAiContext(prId: number, fileId: number): Promise<AiContext> {
  return get(`/ai-analysis/api/prAnalysis/pulls/${prId}/files/${fileId}/ai-context`)
}

// 触发 AI 分析
export function triggerAnalysis(prId: number): Promise<void> {
  return post(`/ai-analysis/api/prAnalysis/pulls/${prId}/analyze`)
}

