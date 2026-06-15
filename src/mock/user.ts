import type { MockMethod } from 'vite-plugin-mock';

export default [
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }: { body: { username: string; password: string } }) => {
      if (body.username === 'admin' && body.password === '123456') {
        return {
          code: 0,
          message: 'success',
          data: {
            token: 'mock-token-admin-2024',
            userInfo: {
              id: 1,
              username: 'admin',
              avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
              roles: ['admin'],
              permissions: ['dashboard:view', 'analysis:view', 'analysis:edit'],
            },
          },
        }
      }
      return { code: 401, message: '用户名或密码错误', data: null }
    },
  },
  {
    url: '/api/auth/userinfo',
    method: 'get',
    response: () => ({
      code: 0,
      message: 'success',
      data: {
        id: 1,
        username: 'admin',
        avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
        roles: ['admin'],
        permissions: ['dashboard:view', 'analysis:view', 'analysis:edit'],
      },
    }),
  },
] as MockMethod[]

