import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { get, post } from '@/api/request';
import type { LoginParams, UserInfo } from '@/types/user';

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') ?? '')
  const userInfo = ref<UserInfo | null>(null)

  const isLoggedIn = computed(() => !!token.value)

  function hasPermission(permission: string): boolean {
    return userInfo.value?.permissions.includes(permission) ?? false
  }

  function hasRole(role: string): boolean {
    return userInfo.value?.roles.includes(role) ?? false
  }

  async function login(params: LoginParams) {
    const data = await post<{ token: string; userInfo: UserInfo }>('/api/auth/login', params)
    token.value = data.token
    userInfo.value = data.userInfo
    localStorage.setItem('token', data.token)
  }

  async function fetchUserInfo() {
    if (!token.value) return
    userInfo.value = await get<UserInfo>('/api/auth/userinfo')
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
  }

  return { token, userInfo, isLoggedIn, hasPermission, hasRole, login, fetchUserInfo, logout }
})

