import { createApp } from 'vue'
import App from '@/App.vue'
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from '@/config/router/routerConfig';
import '@/config/router/interceptor.js';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import msg from '@/config/alterConfig.js'
import i18n from '@/config/i18nConfig.js'
import '@/assets/css/fontStyle.css';
import '@/assets/css/popover.css';
import '@/assets/css/elTable.css';
import '@/assets/css/elInput.css';
import '@/assets/css/elTab.css';
import '@/assets/css/elTree.css';
import '@/assets/css/elCollapse.css';
import '@/assets/css/elDialog.css';
import '@/assets/css/elCard.css';
import '@/assets/css/elSelect.css';
//20240820
//原本是為了解決resizeobserver loop completed with undelivered notifications.
//但因為會和elementPlus的內建配置衝突，改成直接配置vue.config.js忽略警告
// import '@/config/resizeObserverFix.js';

const app = createApp(App);
app.config.globalProperties.$msg = msg;
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(ElementPlus);
app.use(router);
app.use(pinia);
app.use(i18n);

app.mount('#app');