<template>
  <div class="app-layout">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <div class="sidebar-logo">
        <span>🤖</span>
        <span class="logo-text">AI Admin</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        background-color="#001529"
        text-color="rgba(255,255,255,0.75)"
        active-text-color="#fff"
        router
      >
        <el-menu-item
          v-for="item in menuItems"
          :key="item.path"
          :index="item.path"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </el-menu>
    </aside>

    <!-- 主体区域 -->
    <div class="main-container">
      <!-- 顶栏 -->
      <header class="header">
        <div class="header-title">{{ currentTitle }}</div>
        <div class="header-right">
          <span class="username">{{ userStore.userInfo?.username }}</span>
          <el-avatar :size="32" :src="userStore.userInfo?.avatar" />
          <el-button text @click="handleLogout">退出</el-button>
        </div>
      </header>

      <!-- 页面内容 -->
      <main class="page-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { DataAnalysis, Odometer } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/user';

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const menuItems = [
  { path: '/dashboard', title: '概览', icon: Odometer },
  { path: '/analysis', title: 'PR 分析', icon: DataAnalysis },
]

const activeMenu = computed(() => route.path)
const currentTitle = computed(
  () => menuItems.find((m) => m.path === route.path)?.title ?? ''
)

function handleLogout() {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped lang="less">
@import '@/styles/variables.less';

.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: @sidebar-width;
  background: @sidebar-bg;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  .sidebar-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    height: @header-height;
    padding: 0 20px;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .logo-text {
      font-size: 16px;
      font-weight: 600;
    }
  }

  .el-menu {
    border-right: none;
    flex: 1;
  }
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: @header-height;
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;

  .header-title {
    font-size: 16px;
    font-weight: 600;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;

    .username {
      font-size: 14px;
      color: #555;
    }
  }
}

.page-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: @page-bg;
}
</style>

