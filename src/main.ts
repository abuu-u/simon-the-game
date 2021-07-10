import { createApp } from 'vue'
import App from './App.vue'
import { devtools } from './devtools'

createApp(App).use(devtools).mount('#app')
