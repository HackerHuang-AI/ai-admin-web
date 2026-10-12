import {createRouter, createWebHistory} from 'vue-router';
import {useUserStore} from '@/stores/user';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', public: true },
  },
  {
    path: '/',
    component: () => import('@/components/layout/AppLayout.vue'),
    redirect: '/personal-space',
    children: [
      {
        path: 'personal-space',
        name: 'PersonalSpace',
        component: () => import('@/views/personal-space/index.vue'),
        meta: { title: '个人空间' },
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '概览', icon: 'Odometer', permission: 'dashboard:view' },
      },
      {
        path: 'analysis',
        name: 'Analysis',
        component: () => import('@/views/ai-analysis/index.vue'),
        meta: { title: 'PR 分析', icon: 'DataAnalysis', permission: 'analysis:view' },
      },
      {
        path: 'agent',
        name: 'Agent',
        component: () => import('@/views/ai-agent/index.vue'),
        meta: { title: 'Agent' },
      },
      {
        path: 'knowledge-base',
        name: 'KnowledgeBase',
        component: () => import('@/views/ai-knowledge/index.vue'),
        meta: { title: '知识库' },
      },
      {
        path: 'tools',
        name: 'Tools',
        component: () => import('@/views/ai-mcp/index.vue'),
        meta: { title: '工具' },
      },
      {
        path: 'workflow',
        name: 'Workflow',
        component: () => import('@/views/ai-orchestration/index.vue'),
        meta: { title: '工作流' },
      },
      {
        path: 'memory-management',
        name: 'MemoryManagement',
        component: () => import('@/views/ai-memory/index.vue'),
        meta: { title: '记忆管理' },
      },
      {
        path: 'agent-evaluation',
        name: 'AgentEvaluation',
        component: () => import('@/views/ai-eval/index.vue'),
        meta: { title: 'Agent 评测' },
      },
      {
        path: 'experiment-management',
        name: 'ExperimentManagement',
        component: () => import('@/views/ai-experiment/index.vue'),
        meta: { title: '实验管理' },
      },
      {
        path: 'log-tracking',
        name: 'LogTracking',
        component: () => import('@/views/log-tracking/index.vue'),
        meta: { title: '日志追踪' },
      },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()
  if (to.meta.public) return true
  if (!userStore.token) return '/login'

  const permission = to.meta.permission as string | undefined
  if (permission && !userStore.hasPermission(permission)) return '/personal-space'
  return true
})

export default router

