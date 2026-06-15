import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';

// 路由定义，meta.permission 为空表示无需权限
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
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '概览', icon: 'Odometer', permission: 'dashboard:view' },
      },
      {
        path: 'analysis',
        name: 'Analysis',
        component: () => import('@/views/analysis/index.vue'),
        meta: { title: 'PR 分析', icon: 'DataAnalysis', permission: 'analysis:view' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫：未登录跳登录页，无权限提示
router.beforeEach(async (to) => {
  const userStore = useUserStore()

  // 公开页面直接放行
  if (to.meta.public) return true

  // 未登录跳登录页
  if (!userStore.token) return '/login'

  // 有 token 但刷新后 userInfo 丢失，先补拉一次
  if (!userStore.userInfo) {
    await userStore.fetchUserInfo()
  }

  // 有权限要求时校验
  const permission = to.meta.permission as string | undefined
  if (permission && !userStore.hasPermission(permission)) {
    return '/dashboard'
  }

  return true
})

export default router

