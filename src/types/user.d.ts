export interface UserInfo {
  id: string
  username: string
  avatar?: string
  roles: string[]
  permissions: string[]
}

export interface LoginParams {
  account: string
  password: string
}

export interface LoginResult {
  sessionToken: string
  sessionId: string
  userId: string
  tenantId: string
}

