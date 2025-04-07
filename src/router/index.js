// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ProfileView from '../views/ProfileView.vue';
import NotesView from '../views/MyPostsView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import PostDetailView from '../views/PostDetailView.vue';   // <-- Import đúng view chi tiết post
import CreatePostView from '../views/CreatePostView.vue'; // <-- Import view tạo post

import store from '../store';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true },
  },
  // --- Route xem chi tiết bài viết (đã sửa) ---
  {
    path: '/post/:id',          // Sửa thành /post/:id
    name: 'postDetail',         // Sửa thành postDetail
    component: PostDetailView,  // Component đúng
    props: true,
    meta: { requiresAuth: true },
  },
  // --- Route tạo bài viết mới (đã thêm) ---
   {
     path: '/post/new',
     name: 'createPost',
     component: CreatePostView,
     meta: { requiresAuth: true },
   },
  // --- Các routes khác ---
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true },
  },
   {
    path: '/notes',
    name: 'notes',
    component: NotesView,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { requiresGuest: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

// Navigation Guard (giữ nguyên)
router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters['auth/isLoggedIn'];

  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else if (to.meta.requiresGuest && isLoggedIn) {
    next({ name: 'home' });
  } else {
    next();
  }
});

// Rehydrate Auth (giữ nguyên)
router.isReady().then(() => {
    store.dispatch('auth/rehydrateAuth');
});

export default router;