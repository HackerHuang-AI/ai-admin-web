import {createApp, watchEffect} from 'vue';
import {createPinia} from 'pinia';
import App from './App.vue';
import router from './router';
import i18n from './i18n';
import '@/styles/global.less';

watchEffect(() => {
  document.title = i18n.global.t('app.title')
  document.documentElement.lang = i18n.global.locale.value
})

const app = createApp(App)
app.use(i18n)
app.use(createPinia())
app.use(router)
app.mount('#app')
