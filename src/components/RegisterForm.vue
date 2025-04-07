<template>
    <form @submit.prevent="handleSubmit" class="auth-form">
      <h2>Register</h2>
      <div v-if="error" class="error-message">{{ error }}</div>
      <div class="form-group">
        <label for="register-username">Username:</label>
        <input type="text" id="register-username" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="register-password">Password:</label>
        <input type="password" id="register-password" v-model="password" required />
      </div>
       <div class="form-group">
         <label for="register-confirm-password">Confirm Password:</label>
         <input type="password" id="register-confirm-password" v-model="confirmPassword" required />
       </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Registering...' : 'Register' }}
      </button>
       <p>
         Already have an account? <router-link to="/login">Login here</router-link>
       </p>
    </form>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useStore } from 'vuex';
  // import { useRouter } from 'vue-router'; // Không cần nếu action đã xử lý
  
  const store = useStore();
  // const router = useRouter(); // Không cần nếu action đã xử lý
  
  const username = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const loading = ref(false);
  const error = ref(null);
  
  const handleSubmit = async () => {
    if (password.value !== confirmPassword.value) {
       error.value = "Passwords do not match.";
       return;
    }
  
    loading.value = true;
    error.value = null;
    try {
      await store.dispatch('auth/register', {
        username: username.value,
        password: password.value,
      });
      // Đã xử lý điều hướng trong action
      // router.push('/');
    } catch (err) {
      error.value = err.message || 'Registration failed. Please try again.';
    } finally {
      loading.value = false;
    }
  };
  </script>
  
  <style scoped>
  .auth-form {
     /* Ví dụ: thêm style riêng hoặc copy từ LoginForm.css nếu cần */
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
      box-sizing: border-box;
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