import type { MockMethod } from 'vite-plugin-mock';

export default [
  {
    url: '/ai-analysis/api/prAnalysis/pulls/:prId/files',
    method: 'get',
    response: () => ({
      code: 0,
      message: 'success',
      data: {
        list: [
          { id: 1, filename: 'src/components/Button.vue', status: 'modified', additions: 12, deletions: 3 },
          { id: 2, filename: 'src/api/user.ts', status: 'added', additions: 45, deletions: 0 },
          { id: 3, filename: 'src/utils/format.ts', status: 'modified', additions: 8, deletions: 5 },
          { id: 4, filename: 'tests/button.spec.ts', status: 'added', additions: 30, deletions: 0 },
        ],
        total: 4,
        page: 1,
        pageSize: 10,
      },
    }),
  },
  {
    url: '/ai-analysis/api/prAnalysis/pulls/:prId/files/:fileId/ai-context',
    method: 'get',
    response: () => ({
      code: 0,
      message: 'success',
      data: {
        summary: '该文件修改了 Button 组件的样式和交互逻辑，新增了 loading 状态支持。',
        riskLevel: 'low',
        suggestions: [
          '建议补充 loading 状态的单元测试',
          'Props 类型定义可以更严格，考虑使用 PropType',
        ],
      },
    }),
  },
] as MockMethod[]

