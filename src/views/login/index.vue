<template>
  <div class="login-page">
    <header class="page-header">
      <div class="brand">
        <span class="brand-mark"><i></i><i></i><i></i></span>
        <span>企业智库中心</span>
      </div>
      <span class="header-hint">ENTERPRISE KNOWLEDGE CENTER</span>
    </header>

    <main class="login-layout">
      <section class="intro-panel">
        <div class="intro-content">
          <p class="eyebrow">ENTERPRISE INTELLIGENCE</p>
          <h1>汇聚知识，驱动<br />企业智慧决策</h1>
        </div>

        <div class="knowledge-network" aria-hidden="true">
          <span class="network-halo"></span>
          <span class="network-ring ring-one"></span>
          <span class="network-ring ring-two"></span>
          <span class="network-line line-one"></span>
          <span class="network-line line-two"></span>
          <span class="network-dot dot-top"></span>
          <span class="network-dot dot-right"></span>
          <span class="network-dot dot-bottom"></span>
          <span class="network-core">AI</span>
          <span class="network-node node-book"><i></i><b>知识库</b></span>
          <span class="network-node node-agent"><i></i><b>智能体</b></span>
          <span class="network-node node-data"><i></i><b>数据</b></span>
          <span class="network-node node-tool"><i></i><b>工具</b></span>
        </div>

        <div class="feature-list" aria-label="平台能力">
          <div><span>⌁</span><b>知识沉淀</b><small>统一管理企业内容</small></div>
          <div><span>◌</span><b>智能检索</b><small>快速获取所需信息</small></div>
          <div><span>✦</span><b>协作共享</b><small>连接团队与经验</small></div>
          <div><span>⌘</span><b>安全可信</b><small>守护企业数据</small></div>
        </div>
      </section>

      <section class="form-panel">
        <div class="form-content">
          <div class="login-heading">
            <h2>欢迎登录</h2>
            <p>连接企业知识，开启智能协作</p>
          </div>

          <div class="login-tabs" role="tablist" aria-label="登录方式">
            <button
              v-for="item in loginMethods"
              :key="item.value"
              :class="{ active: activeMethod === item.value }"
              type="button"
              role="tab"
              :aria-selected="activeMethod === item.value"
              @click="activeMethod = item.value"
            >
              {{ item.label }}
            </button>
          </div>

          <el-form
            v-if="activeMethod === 'password'"
            ref="formRef"
            :model="form"
            :rules="rules"
            size="large"
            @keyup.enter="handleLogin"
          >
            <el-form-item prop="account">
              <el-input v-model="form.account" placeholder="请输入账号" :prefix-icon="User" />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="请输入密码"
                :prefix-icon="Lock"
                show-password
              />
            </el-form-item>
            <el-button type="primary" :loading="loading" class="login-button" @click="handleLogin">登录</el-button>
          </el-form>

          <div v-else-if="activeMethod === 'qrcode'" class="qrcode-login">
            <div class="qrcode" :key="qrVersion" aria-label="模拟登录二维码"></div>
            <p class="qrcode-title">请使用企业应用扫码登录</p>
            <button class="text-button" type="button" @click="refreshQrcode">刷新二维码</button>
          </div>

          <div v-else-if="activeMethod === 'sms'" class="coming-soon">
            <div class="method-symbol">短信</div>
            <h3>短信验证码登录</h3>
            <p>该登录方式正在接入认证服务，敬请期待。</p>
            <el-button plain class="secondary-button" @click="showPendingMessage('短信验证码登录')">发送验证码</el-button>
          </div>

          <div v-else class="coming-soon">
            <div class="method-symbol">SSO</div>
            <h3>单点登录</h3>
            <p>使用企业统一身份认证，一键安全登录平台。</p>
            <el-button plain class="secondary-button" @click="showPendingMessage('SSO 登录')">企业 SSO 登录</el-button>
          </div>

          <p class="login-tip">登录即代表你已阅读并同意平台使用规范</p>
        </div>
      </section>
    </main>

    <footer>© 2026 企业智库中心</footer>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import type {FormInstance} from 'element-plus'
import {ElMessage} from 'element-plus'
import {Lock, User} from '@element-plus/icons-vue'
import {useUserStore} from '@/stores/user'

type LoginMethod = 'password' | 'qrcode' | 'sms' | 'sso'

const loginMethods: { label: string; value: LoginMethod }[] = [
  { label: '密码登录', value: 'password' },
  { label: '扫码登录', value: 'qrcode' },
  { label: '短信登录', value: 'sms' },
  { label: 'SSO 登录', value: 'sso' },
]

const router = useRouter()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const activeMethod = ref<LoginMethod>('password')
const qrVersion = ref(0)
const loading = ref(false)
const form = reactive({ account: '', password: '' })

const rules = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

function refreshQrcode() {
  qrVersion.value += 1
  ElMessage.success('二维码已刷新')
}

function showPendingMessage(method: string) {
  ElMessage.info(`${method}即将接入`)
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
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow: hidden;
  color: #222a50;
  font-family: 'HarmonyOS Sans SC', 'PingFang SC', Inter, 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, sans-serif;
  background: url('@/assets/login-hero-V2.png') center / cover no-repeat;
}

.login-page::before {
  position: absolute;
  inset: 0;
  content: '';
  background: rgba(255, 255, 255, .08);
  pointer-events: none;
}

.page-header,
.login-layout,
footer { position: relative; z-index: 1; }

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(1440px, calc(100% - 96px));
  margin: 32px auto 0;
}

.brand { display: flex; align-items: center; gap: 8px; color: #28396f; font-size: 14px; font-weight: 650; }
.brand-mark { display: inline-flex; align-items: end; gap: 2px; width: 20px; height: 20px; padding: 4px; background: linear-gradient(135deg, #7b8cff, #5264ed); border-radius: 5px; box-shadow: 0 4px 9px rgba(81, 100, 235, .2); }
.brand-mark i { display: block; width: 2px; background: #fff; border-radius: 2px; }
.brand-mark i:nth-child(1) { height: 6px; opacity: .75; }
.brand-mark i:nth-child(2) { height: 11px; }
.brand-mark i:nth-child(3) { height: 4px; opacity: .9; }
.header-hint { color: #7d89a8; font-size: 10px; letter-spacing: 1.3px; }

.login-layout { display: grid; grid-template-columns: minmax(0, 1fr) clamp(280px, 27vw, 420px); align-items: center; width: min(1440px, calc(100% - 96px)); flex: 1; gap: clamp(48px, 8vw, 132px); margin: 12px auto; }
.intro-panel { position: relative; min-height: clamp(390px, 43vw, 660px); }
.intro-content { position: absolute; top: 18%; left: 0; }
.eyebrow { margin: 0 0 clamp(9px, .9vw, 13px); color: #7381d7; font-size: clamp(9px, .75vw, 11px); font-weight: 600; letter-spacing: 1.5px; }
h1 { margin: 0; color: #293365; font-size: clamp(22px, 2.7vw, 42px); font-weight: 650; line-height: 1.33; letter-spacing: -.5px; }
.intro-copy { max-width: 320px; margin: clamp(10px, 1vw, 16px) 0 0; color: #8994af; font-size: clamp(10px, .85vw, 13px); line-height: 1.8; }

.knowledge-network { display: none; position: absolute; top: 40%; left: 78%; width: 270px; height: 270px; transform: translate(-50%, -34%) scale(.72); transform-origin: center; }
@media (min-width: 1100px) { .knowledge-network { transform: translate(-50%, -34%) scale(1.12); } }
.network-halo { position: absolute; inset: 58px; background: radial-gradient(circle, rgba(117, 133, 245, .23), rgba(117, 133, 245, .08) 43%, transparent 66%); border-radius: 50%; filter: blur(2px); }
.network-ring { position: absolute; border: 1px solid rgba(107, 127, 247, .32); border-radius: 50%; }
.ring-one { inset: 14px; }
.ring-two { inset: 57px; border-color: rgba(116, 137, 247, .42); }
.network-line { position: absolute; top: 50%; left: 50%; width: 150px; height: 1px; background: linear-gradient(90deg, rgba(111, 130, 246, .75), rgba(111, 130, 246, .08)); transform-origin: left center; }
.line-one { transform: rotate(-50deg); }
.line-two { transform: rotate(142deg); }
.network-dot { position: absolute; width: 7px; height: 7px; background: #7588f4; border: 2px solid #edf1ff; border-radius: 50%; box-shadow: 0 0 8px rgba(92, 111, 238, .55); }
.dot-top { top: 18px; left: 72px; }
.dot-right { top: 116px; right: 18px; }
.dot-bottom { bottom: 22px; right: 72px; }
.network-core { position: absolute; top: 94px; left: 94px; display: grid; width: 82px; height: 82px; place-items: center; color: #fff; font-size: 22px; font-weight: 650; background: radial-gradient(circle at 35% 24%, #a5b1ff, #6878ee 58%, #5363df); border: 6px solid rgba(255, 255, 255, .94); border-radius: 50%; box-shadow: 0 0 0 16px rgba(112, 130, 245, .1), 0 16px 28px rgba(82, 100, 230, .32); }
.network-node { position: absolute; display: grid; width: 58px; height: 58px; place-items: center; color: #6274df; background: rgba(255, 255, 255, .94); border: 1px solid #dde4ff; border-radius: 12px; box-shadow: 0 9px 18px rgba(77, 94, 183, .1); }
.network-node i { display: block; width: 16px; height: 12px; margin-bottom: 2px; background: linear-gradient(135deg, #7f8ff9, #5c6fe7); border-radius: 3px 3px 5px 5px; }
.network-node b { font-size: 10px; font-weight: 600; }
.node-book { top: -2px; left: 106px; }
.node-agent { top: 78px; right: -4px; }
.node-data { right: 28px; bottom: 8px; }
.node-tool { bottom: 4px; left: 24px; }
.node-agent i { width: 14px; height: 14px; border-radius: 50%; }
.node-data i { width: 17px; height: 10px; border-radius: 3px; }
.node-tool i { width: 15px; height: 15px; background: linear-gradient(135deg, transparent 42%, #6274e9 42% 58%, transparent 58%), linear-gradient(45deg, transparent 42%, #6274e9 42% 58%, transparent 58%); }

.feature-list { position: absolute; bottom: 3%; left: 0; display: grid; grid-template-columns: repeat(4, minmax(72px, 1fr)); width: min(540px, 100%); gap: 12px; }
.feature-list div { display: grid; grid-template-columns: 20px 1fr; gap: 1px 6px; }
.feature-list span { grid-row: span 2; display: grid; width: 22px; height: 22px; place-items: center; color: #5369df; font-size: 14px; background: rgba(255, 255, 255, .78); border: 1px solid #ced8ff; border-radius: 5px; }
.feature-list b { color: #40517d; font-size: 12px; white-space: nowrap; }
.feature-list small { color: #73809c; font-size: 10px; line-height: 1.4; }

.form-panel { box-sizing: border-box; width: 100%; min-height: clamp(390px, 40vw, 580px); justify-self: end; padding: clamp(30px, 4vw, 64px) clamp(26px, 3.65vw, 58px) clamp(26px, 3vw, 48px); background: rgba(255, 255, 255, .94); border: 1px solid rgba(255, 255, 255, .82); border-radius: clamp(7px, .7vw, 10px); box-shadow: 0 20px 48px rgba(48, 61, 129, .16), 0 1px 0 rgba(255, 255, 255, .7) inset; backdrop-filter: blur(10px); }
.form-content { width: 100%; }
.login-heading { margin-bottom: clamp(18px, 2vw, 32px); }
.login-heading h2 { margin: 0 0 clamp(6px, .7vw, 9px); color: #222a4b; font-size: clamp(18px, 2vw, 29px); font-weight: 650; }
.login-heading p { margin: 0; color: #727d94; font-size: clamp(10px, .95vw, 14px); }
.login-tabs { display: grid; grid-template-columns: repeat(4, 1fr); margin-bottom: clamp(16px, 1.7vw, 26px); border-bottom: 1px solid #eceef5; }
.login-tabs button { position: relative; padding: 0 0 clamp(8px, .9vw, 12px); color: #748098; font: inherit; font-size: clamp(10px, .95vw, 14px); white-space: nowrap; cursor: pointer; background: transparent; border: 0; }
.login-tabs button.active { color: #5b6cea; font-weight: 600; }
.login-tabs button.active::after { position: absolute; right: 22%; bottom: -1px; left: 22%; height: 2px; content: ''; background: #5b6cea; border-radius: 3px; }
:deep(.el-form-item) { margin-bottom: clamp(11px, 1.2vw, 18px); }
:deep(.el-input__wrapper) { min-height: clamp(36px, 3.5vw, 50px); padding: 1px clamp(10px, 1.1vw, 14px); background: rgba(250, 251, 254, .92); border-radius: 4px; box-shadow: 0 0 0 1px #dbe1ed inset; }
:deep(.el-input__wrapper:hover), :deep(.el-input__wrapper.is-focus) { box-shadow: 0 0 0 1px #7584ef inset; }
.login-button { width: 100%; height: clamp(36px, 3.5vw, 50px); margin-top: 2px; font-size: clamp(11px, 1.05vw, 15px); font-weight: 600; letter-spacing: 3px; background: linear-gradient(90deg, #5266e9, #7181f4); border: 0; border-radius: 4px; box-shadow: 0 8px 16px rgba(87, 105, 237, .24); }
.login-button:hover { transform: translateY(-1px); box-shadow: 0 11px 21px rgba(87, 105, 237, .27); }
.qrcode-login, .coming-soon { display: flex; flex-direction: column; align-items: center; min-height: 158px; text-align: center; }
.qrcode { width: 122px; height: 122px; background-color: #fff; background-image: linear-gradient(90deg, #394772 10%, transparent 10% 20%, #394772 20% 30%, transparent 30% 40%, #394772 40% 50%, transparent 50% 60%, #394772 60% 70%, transparent 70% 80%, #394772 80% 90%, transparent 90%), linear-gradient(#394772 10%, transparent 10% 20%, #394772 20% 30%, transparent 30% 40%, #394772 40% 50%, transparent 50% 60%, #394772 60% 70%, transparent 70% 80%, #394772 80% 90%, transparent 90%); background-size: 12px 12px; border: 7px solid #fff; box-shadow: 0 0 0 1px #e0e5f0; }
.qrcode-title { margin: 12px 0 6px; color: #59647e; font-size: 12px; }
.text-button { padding: 0; color: #6070e9; font: inherit; font-size: 12px; cursor: pointer; background: transparent; border: 0; }
.coming-soon { justify-content: center; }
.coming-soon h3 { margin: 11px 0 7px; color: #44506b; font-size: 14px; }
.coming-soon p { margin: 0 0 16px; color: #929aab; font-size: 12px; }
.method-symbol { display: grid; width: 40px; height: 40px; place-items: center; color: #5d6ce4; font-size: 10px; font-weight: 700; background: #f0f2ff; border: 1px solid #e0e4ff; border-radius: 50%; }
.secondary-button { min-width: 132px; color: #5d6ce4; border-color: #cbd2fc; }
.login-tip { margin: 22px 0 0; color: #7e899d; font-size: 11px; text-align: center; }
footer { width: min(1440px, calc(100% - 96px)); margin: 0 auto 22px; color: #7885a1; font-size: 10px; }

@media (prefers-reduced-motion: reduce) { .login-button { transition: none; } }
@media (max-width: 640px) { .page-header, .login-layout, footer { width: min(430px, calc(100% - 48px)); } .header-hint, .intro-panel { display: none; } .login-layout { display: block; flex: 0; margin: auto; } .form-panel { margin: 35px 0; padding: 38px; } }
@media (max-width: 480px) { .page-header { margin-top: 22px; } .form-panel { padding: 30px 24px; } .login-tabs button { font-size: 11px; } }
</style>

