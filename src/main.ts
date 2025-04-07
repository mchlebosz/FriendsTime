import './assets/index.css'
import { createApp, ref } from 'vue'
import App from './App.vue'

const app = createApp(App)

// Provide theme state
const isDark = ref(false)
app.provide('isDark', isDark)

app.mount('#app')

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/FriendsTime/sw.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope)
      })
      .catch((error) => {
        console.error('ServiceWorker registration failed: ', error)
      })
  })
}
