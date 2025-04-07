import './assets/index.css'
import { createApp, ref } from 'vue'
import App from './App.vue'

const app = createApp(App)

// Provide theme state
const isDark = ref(false)
app.provide('isDark', isDark)

app.mount('#app')
