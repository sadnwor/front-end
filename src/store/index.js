// src/store/index.js
import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import auth from './modules/auth';
import user from './modules/user';
import posts from './modules/posts';
import comments from './modules/comments'; // <-- Import module comments

// Cấu hình persisted state (comments thường không cần lưu vào localStorage)
const persistedState = createPersistedState({
  paths: ['auth', 'user.profile'], // Chỉ lưu auth và user profile
  storage: window.localStorage,
});

const store = createStore({
  modules: {
    auth,
    user,
    posts,
    comments, // <-- Đăng ký module comments
  },
  plugins: [persistedState],
});

export default store;