<template>
  <div class="login-page">
    <div class="login-box">
      <div class="login-logo">
        <span class="logo-icon">🤖</span>
        <h1>AI Admin</h1>
      </div>
      <el-form ref="formRef" :model="form" :rules="rules" size="large" @keyup.enter="handleLogin">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名（admin）" :prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码（123456）"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-button type="primary" :loading="loading" style="width: 100%" @click="handleLogin">
          登 录
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { FormInstance } from 'element-plus';
import { ElMessage } from 'element-plus';
import { Lock, User } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/user';

const router = useRouter()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({ username: 'admin', password: '123456' })

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleLogin() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  loading.value = true
  try {
    await userStore.login(form)
    ElMessage.success('登录成功')
    router.push('/')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="less">
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 380px;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.login-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;

  .logo-icon {
    font-size: 36px;
  }

  h1 {
    font-size: 24px;
    font-weight: 700;
    color: #1a1a1a;
  }
}
</style>

