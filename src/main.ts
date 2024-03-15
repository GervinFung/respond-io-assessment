import { createApp } from 'vue';
import { createPinia } from 'pinia';

import Antd from 'ant-design-vue';

import App from './app';
import router from './router';

const app = createApp(App);

app.use(createPinia()).use(Antd).use(router).mount('#app');
