// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store' // Import Vuex store
import './assets/main.css' // Import CSS chính
import '@fortawesome/fontawesome-free/css/all.css';

const app = createApp(App)

app.use(router) // Sử dụng Vue Router
app.use(store)  // Sử dụng Vuex

app.mount('#app')