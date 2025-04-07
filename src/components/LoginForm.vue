<template>
    <form @submit.prevent="handleSubmit" class="auth-form">
      <h2>Login</h2>
      <div v-if="error" class="error-message">{{ error }}</div>
      <div class="form-group">
        <label for="login-username">Username:</label>
        <input type="text" id="login-username" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="login-password">Password:</label>
        <input type="password" id="login-password" v-model="password" required />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
      <p>
        Don't have an account? <router-link to="/register">Register here</router-link>
      </p>
    </form>
  </template>
 
  <script setup>
  import { ref } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter, useRoute } from 'vue-router'; // Import useRoute
 
  const store = useStore();
  const router = useRouter();
  const route = useRoute(); // Để lấy query param redirect
 
  const username = ref('');
  const password = ref('');
  const loading = ref(false);
  const error = ref(null);
 
  const handleSubmit = async () => {
    loading.value = true;
    error.value = null;
    try {
      await store.dispatch('auth/login', {
        username: username.value,
        password: password.value,
      });
      // Đã xử lý điều hướng trong action, nhưng có thể thêm redirect nếu cần
      // const redirectPath = route.query.redirect || '/';
      // router.push(redirectPath);
    } catch (err) {
      error.value = err.message || 'Login failed. Please check your credentials.';
    } finally {
      loading.value = false;
    }
  };
  </script>
 
  <style scoped>
  /* Thêm CSS cho form tại đây hoặc dùng CSS toàn cục */
  .auth-form {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #fff;
  }
   .form-group {
     margin-bottom: 1rem;
   }
   .form-group label {
     display: block;
     margin-bottom: 0.5rem;
   }
   .form-group input {
     width: 100%;
     padding: 0.5rem;
     box-sizing: border-box; /* Quan trọng */
   }
   button {
      padding: 0.7rem 1.5rem;
      cursor: pointer;
   }
   button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
   }
   .error-message {
      color: red;
      margin-bottom: 1rem;
      font-size: 0.9em;
   }
   p { margin-top: 1rem; font-size: 0.9em;}
  </style>