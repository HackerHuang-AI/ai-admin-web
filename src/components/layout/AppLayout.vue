<template>
  <div class="app-layout" :class="{ collapsed: isCollapsed }">
    <aside class="sidebar">
      <div class="sidebar-logo">
        <span class="logo-mark">智</span>
        <span v-show="!isCollapsed" class="logo-text">企业智库中心</span>
        <button class="collapse-button" type="button" :aria-label="isCollapsed ? '展开侧边栏' : '收起侧边栏'" @click="isCollapsed = !isCollapsed">
          {{ isCollapsed ? '›' : '‹' }}
        </button>
      </div>

      <el-menu :default-active="activeMenu" :collapse="isCollapsed" router>
        <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path">
          <el-icon><component :is="item.icon" /></el-icon>
          <template #title>{{ item.title }}</template>
        </el-menu-item>
      </el-menu>

      <div class="sidebar-user">
        <el-avatar :size="28" :src="userStore.userInfo?.avatar">{{ userInitial }}</el-avatar>
        <div v-show="!isCollapsed" class="sidebar-user-info">
          <strong>{{ userStore.userInfo?.username || '个人空间' }}</strong>
          <span>已登录</span>
        </div>
      </div>
    </aside>

    <div class="main-container">
      <header class="header">
        <div class="header-title">{{ currentTitle }}</div>
        <div class="header-right">
          <span class="username">{{ userStore.userInfo?.username }}</span>
          <el-avatar :size="30" :src="userStore.userInfo?.avatar">{{ userInitial }}</el-avatar>
          <button class="logout-button" type="button" @click="handleLogout">退出登录</button>
        </div>
      </header>

      <main class="page-content"><router-view /></main>
    </div>

    <div class="assistant-widget">
      <section v-if="chatVisible" class="assistant-dialog" aria-label="智库助手对话框">
        <header>
          <div><b>智库助手</b><span>在线 · 为你检索企业知识</span></div>
          <button type="button" aria-label="关闭对话" @click="chatVisible = false">×</button>
        </header>
        <div class="chat-messages">
          <div class="assistant-message">你好，我是智库助手。有什么可以帮你？</div>
          <div v-for="message in chatMessages" :key="message" class="user-message">{{ message }}</div>
        </div>
        <form class="chat-input" @submit.prevent="sendMessage">
          <input v-model="chatMessage" placeholder="输入问题，开始对话" />
          <button type="submit" :disabled="!chatMessage.trim()">发送</button>
        </form>
      </section>
      <button class="assistant-button" type="button" aria-label="打开智库助手" @click="chatVisible = !chatVisible">✦</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {
  Collection,
  Connection,
  DataAnalysis,
  Document,
  Grid,
  Memo,
  Share,
  Tools,
  UserFilled
} from '@element-plus/icons-vue'
import {useUserStore} from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const isCollapsed = ref(false)
const chatVisible = ref(false)
const chatMessage = ref('')
const chatMessages = ref<string[]>([])

const menuItems = [
  { path: '/personal-space', title: '个人空间', icon: UserFilled },
  { path: '/agent', title: 'Agent', icon: Connection },
  { path: '/knowledge-base', title: '知识库', icon: Collection },
  { path: '/tools', title: '工具', icon: Tools },
  { path: '/workflow', title: '工作流', icon: Share },
  { path: '/memory-management', title: '记忆管理', icon: Memo },
  { path: '/agent-evaluation', title: 'Agent 评测', icon: Grid },
  { path: '/experiment-management', title: '实验管理', icon: DataAnalysis },
  { path: '/log-tracking', title: '日志追踪', icon: Document },
]

const activeMenu = computed(() => route.path)
const currentTitle = computed(() => menuItems.find((item) => item.path === route.path)?.title ?? '企业智库中心')
const userInitial = computed(() => userStore.userInfo?.username?.slice(0, 1).toUpperCase() || 'U')

function sendMessage() {
  const message = chatMessage.value.trim()
  if (!message) return
  chatMessages.value.push(message)
  chatMessage.value = ''
}

function handleLogout() {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped lang="less">
.app-layout { display: flex; height: 100vh; overflow: hidden; background: #f7f8fc; color: #202744; }
.sidebar { display: flex; flex-direction: column; width: 224px; flex: 0 0 224px; background: #fff; border-right: 1px solid #e9ecf4; transition: width .2s ease, flex-basis .2s ease; }
.collapsed .sidebar { width: 64px; flex-basis: 64px; }
.sidebar-logo { display: flex; align-items: center; gap: 9px; min-height: 64px; padding: 0 14px; border-bottom: 1px solid #edf0f5; }
.logo-mark { display: grid; width: 30px; height: 30px; flex: 0 0 30px; place-items: center; color: #fff; font-size: 14px; font-weight: 700; background: linear-gradient(135deg, #5c6ded, #6d7cf2); border-radius: 9px; box-shadow: 0 5px 12px rgba(84, 103, 234, .2); }
.logo-text { overflow: hidden; color: #1f2749; font-size: 15px; font-weight: 650; white-space: nowrap; }
.collapse-button { width: 22px; height: 22px; margin-left: auto; color: #7e879f; font-size: 21px; line-height: 18px; cursor: pointer; background: #f6f7fb; border: 0; border-radius: 5px; }
:deep(.el-menu) { flex: 1; padding: 12px 8px; border-right: 0; background: transparent; }
:deep(.el-menu-item) { height: 42px; margin: 3px 0; color: #66708a; border-radius: 7px; }
:deep(.el-menu-item:hover) { color: #5465e8; background: #f4f5ff; }
:deep(.el-menu-item[class~='is-active']) { color: #5263e9; font-weight: 600; background: #eef0ff; }
:deep(.el-menu--collapse .el-menu-item) { padding: 0 20px; }
.sidebar-user { display: flex; align-items: center; gap: 9px; min-height: 58px; padding: 0 14px; border-top: 1px solid #edf0f5; }
.sidebar-user-info { display: grid; overflow: hidden; line-height: 1.25; }
.sidebar-user-info strong { overflow: hidden; color: #3f4864; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
.sidebar-user-info span { color: #a3abbc; font-size: 11px; }
.main-container { display: flex; min-width: 0; flex: 1; flex-direction: column; overflow: hidden; }
.header { display: flex; align-items: center; justify-content: space-between; height: 64px; padding: 0 30px; background: #fff; border-bottom: 1px solid #edf0f5; }
.header-title { color: #1d2543; font-size: 17px; font-weight: 650; }
.header-right { display: flex; align-items: center; gap: 10px; }
.username { color: #66708a; font-size: 13px; }
.logout-button { padding: 6px 9px; color: #7b8499; font: inherit; font-size: 12px; cursor: pointer; background: transparent; border: 0; }
.logout-button:hover { color: #5263e9; }
.page-content { flex: 1; padding: 28px 32px; overflow-y: auto; }
.assistant-widget { position: fixed; right: 30px; bottom: 28px; z-index: 10; }
.assistant-button { display: grid; width: 46px; height: 46px; margin-left: auto; place-items: center; color: #fff; font-size: 21px; cursor: pointer; background: linear-gradient(135deg, #6374f2, #4d5ddf); border: 4px solid #fff; border-radius: 50%; box-shadow: 0 8px 20px rgba(72, 90, 207, .3); }
.assistant-dialog { width: 320px; margin-bottom: 12px; overflow: hidden; background: #fff; border: 1px solid #e4e8f2; border-radius: 12px; box-shadow: 0 18px 45px rgba(38, 48, 105, .16); }
.assistant-dialog header { display: flex; align-items: flex-start; justify-content: space-between; padding: 15px 16px; color: #fff; background: linear-gradient(135deg, #6172f0, #5261de); }
.assistant-dialog header div { display: grid; gap: 3px; }
.assistant-dialog header b { font-size: 14px; }
.assistant-dialog header span { color: rgba(255,255,255,.74); font-size: 11px; }
.assistant-dialog header button { padding: 0; color: #fff; font-size: 22px; line-height: 18px; cursor: pointer; background: transparent; border: 0; }
.chat-messages { display: flex; min-height: 180px; max-height: 250px; flex-direction: column; gap: 10px; padding: 16px; overflow-y: auto; }
.assistant-message, .user-message { max-width: 84%; padding: 9px 11px; font-size: 12px; line-height: 1.55; border-radius: 8px; }
.assistant-message { align-self: flex-start; color: #59627a; background: #f4f6fb; }
.user-message { align-self: flex-end; color: #fff; background: #6171ed; }
.chat-input { display: flex; gap: 8px; padding: 11px; border-top: 1px solid #edf0f5; }
.chat-input input { min-width: 0; flex: 1; padding: 8px 9px; color: #313a56; font: inherit; font-size: 12px; outline: 0; background: #f7f8fc; border: 1px solid #e9ecf4; border-radius: 5px; }
.chat-input input:focus { border-color: #7c89ef; }
.chat-input button { padding: 0 10px; color: #fff; font: inherit; font-size: 12px; cursor: pointer; background: #5b6bea; border: 0; border-radius: 5px; }
.chat-input button:disabled { cursor: not-allowed; opacity: .45; }
@media (max-width: 700px) { .sidebar { width: 64px; flex-basis: 64px; } .sidebar .logo-text, .sidebar .collapse-button, .sidebar-user-info { display: none; } .page-content { padding: 20px; } .header { padding: 0 20px; } .username, .logout-button { display: none; } .assistant-widget { right: 20px; bottom: 20px; } }
</style>

