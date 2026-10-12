import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import {post} from '@/api/request';
import type {LoginParams, LoginResult, UserInfo} from '@/types/user';

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') ?? '')
  const userInfo = ref<UserInfo | null>(JSON.parse(localStorage.getItem('userInfo') ?? 'null'))

  const isLoggedIn = computed(() => !!token.value)

  function hasPermission(permission: string): boolean {
    return userInfo.value?.permissions.includes(permission) ?? false
  }

  function hasRole(role: string): boolean {
    return userInfo.value?.roles.includes(role) ?? false
  }

  async function login(params: LoginParams) {
    const data = await post<LoginResult>('/ai-base/api/access/login', {
      loginType: 'ACCOUNT_PASSWORD',
      ...params,
      deviceId: 'local-login-device-0001',
    })
    token.value = data.sessionToken
    userInfo.value = {
      id: data.userId,
      username: params.account,
      roles: [],
      permissions: [],
    }
    localStorage.setItem('token', data.sessionToken)
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  return { token, userInfo, isLoggedIn, hasPermission, hasRole, login, logout }
})

