<template>
  <section class="personal-space">
    <div class="page-heading">
      <p>PERSONAL SPACE</p>
      <h1>个人空间</h1>
      <span>查看并管理你的企业智库中心个人信息</span>
    </div>

    <section class="profile-card">
      <div class="profile-summary">
        <el-avatar :size="72" :src="profile.user.avatarUrl">{{ userInitial }}</el-avatar>
        <div>
          <h2>{{ profile.user.nickName || profile.user.name || profile.user.username || '个人用户' }}</h2>
          <p>{{ profile.user.username || userStore.userInfo?.username || '—' }}</p>
        </div>
      </div>

      <dl class="profile-list">
        <div><dt>账号</dt><dd>{{ profile.user.username || userStore.userInfo?.username || '未设置' }}</dd></div>
        <div><dt>邮箱</dt><dd>{{ profile.user.email || '未设置' }}</dd></div>
        <div><dt>手机号</dt><dd>{{ profile.user.phoneNumber || '未设置' }}</dd></div>
        <div><dt>个人空间</dt><dd>{{ profile.personalTenant.tenantName || '未设置' }}</dd></div>
      </dl>
    </section>

    <section class="space-card">
      <div>
        <p class="card-label">我的个人空间</p>
        <h2>{{ profile.personalTenant.tenantName || '个人空间' }}</h2>
        <p>个人知识、对话和工作内容将在此处持续沉淀。</p>
      </div>
      <span class="space-status">已启用</span>
    </section>
  </section>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive} from 'vue'
import {get} from '@/api/request'
import {useUserStore} from '@/stores/user'

interface ProfileResponse {
  user?: {
    username?: string
    nickName?: string
    name?: string
    email?: string
    phoneNumber?: string
    avatarUrl?: string
  }
  personalTenant?: {
    tenantName?: string
  }
}

const userStore = useUserStore()
const profile = reactive({
  user: {} as NonNullable<ProfileResponse['user']>,
  personalTenant: {} as NonNullable<ProfileResponse['personalTenant']>,
})
const userInitial = computed(() => (profile.user.nickName || profile.user.name || profile.user.username || userStore.userInfo?.username || 'U').slice(0, 1).toUpperCase())

onMounted(async () => {
  const data = await get<ProfileResponse>('/ai-base/api/personal/users/profile')
  Object.assign(profile.user, data.user)
  Object.assign(profile.personalTenant, data.personalTenant)
})
</script>

<style scoped lang="less">
.personal-space { max-width: 1040px; margin: 0 auto; }
.page-heading { margin-bottom: 24px; }
.page-heading p { margin: 0 0 7px; color: #7180dc; font-size: 11px; font-weight: 600; letter-spacing: 1.25px; }
.page-heading h1 { margin: 0; color: #1d2543; font-size: 28px; font-weight: 650; }
.page-heading span { display: block; margin-top: 9px; color: #8a92a5; font-size: 13px; }
.profile-card, .space-card { background: #fff; border: 1px solid #e7eaf2; border-radius: 12px; box-shadow: 0 5px 16px rgba(44, 54, 105, .035); }
.profile-card { padding: 30px 34px; }
.profile-summary { display: flex; align-items: center; gap: 18px; padding-bottom: 27px; border-bottom: 1px solid #eef0f5; }
.profile-summary h2 { margin: 0 0 6px; color: #27304f; font-size: 20px; }
.profile-summary p { margin: 0; color: #8f97aa; font-size: 13px; }
.profile-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0 48px; margin: 20px 0 0; }
.profile-list div { display: flex; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #f0f2f6; }
.profile-list dt { color: #9299ab; font-size: 13px; }
.profile-list dd { margin: 0; color: #404962; font-size: 13px; }
.space-card { display: flex; align-items: center; justify-content: space-between; margin-top: 18px; padding: 25px 30px; }
.card-label { margin: 0 0 9px; color: #8f97aa; font-size: 12px; }
.space-card h2 { margin: 0; color: #303953; font-size: 16px; }
.space-card div > p:last-child { margin: 9px 0 0; color: #9ca3b4; font-size: 13px; }
.space-status { padding: 5px 10px; color: #4f62df; font-size: 12px; background: #f0f2ff; border-radius: 4px; }
@media (max-width: 640px) { .profile-card { padding: 24px; } .profile-list { grid-template-columns: 1fr; gap: 0; } .space-card { align-items: flex-start; gap: 12px; flex-direction: column; } }
</style>
