<template>
  <form @submit.prevent="handleSubmit" class="auth-form">
    <h2 class="form-title">Login</h2> <div v-if="error" class="error-message">{{ error }}</div>

    <div class="form-group">
      <label for="login-username">Username</label> <input
        type="text"
        id="login-username"
        v-model="username"
        required
        placeholder="Enter your username" />
    </div>

    <div class="form-group">
      <label for="login-password">Password</label> <input
        type="password"
        id="login-password"
        v-model="password"
        required
        placeholder="Enter your password" />
    </div>

    <div class="form-actions">
        <button type="submit" :disabled="loading" class="submit-button">
            {{ loading ? 'Logging in...' : 'Login' }}
        </button>
    </div>


    <p class="switch-form-text"> Don't have an account? <router-link to="/register">Register here</router-link>
    </p>
  </form>
</template>

<script setup>
// --- Phần script setup giữ nguyên như của bạn ---
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';

const store = useStore();
const router = useRouter();
const route = useRoute();

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
    // Action 'auth/login' đã xử lý điều hướng
  } catch (err) {
    error.value = err.message || 'Login failed. Please check your credentials.';
  } finally {
    loading.value = false;
  }
};
// --- Kết thúc script setup ---
</script>

<style scoped>
/* --- Style mới cho Form Login --- */
.auth-form {
  max-width: 380px; /* Giảm chiều rộng một chút */
  margin: 3rem auto; /* Tăng margin trên dưới */
  padding: 2.5rem; /* Tăng padding */
  border: 1px solid var(--color-border); /* Dùng biến màu border */
  border-radius: 12px; /* Bo góc nhiều hơn */
  background-color: var(--color-background); /* Dùng biến màu nền */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.07); /* Thêm bóng đổ nhẹ */
  transition: box-shadow 0.3s ease;
}
.auth-form:hover {
   box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.form-title {
  text-align: center;
  margin-top: 0;
  margin-bottom: 2rem; /* Tăng khoảng cách dưới title */
  font-size: 1.8em; /* Tăng kích thước title */
  font-weight: 600; /* Đậm vừa */
  color: var(--color-heading); /* Dùng biến màu tiêu đề */
}

.form-group {
  margin-bottom: 1.5rem; /* Tăng khoảng cách giữa các group */
}

.form-group label {
  display: block;
  margin-bottom: 0.6rem; /* Tăng khoảng cách dưới label */
  font-weight: 500; /* Đậm hơn chút */
  font-size: 0.9em;
  color: var(--color-text-light-2); /* Màu text nhạt hơn */
}

.form-group input {
  width: 100%;
  padding: 0.8rem 1rem; /* Tăng padding input */
  box-sizing: border-box;
  border: 1px solid var(--color-border); /* Dùng biến màu border */
  border-radius: 6px; /* Bo góc input */
  background-color: var(--color-background-soft); /* Nền input hơi khác nền form */
  color: var(--color-text);
  font-size: 1em;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-border-hover); /* Màu border đậm hơn khi focus */
  box-shadow: 0 0 0 3px hsla(160, 100%, 37%, 0.1); /* Bóng mờ màu xanh khi focus */
}

/* Style cho nút submit */
.form-actions {
    margin-top: 2rem; /* Khoảng cách trên nút */
}
.submit-button {
  display: block; /* Để chiếm hết chiều rộng */
  width: 100%;
  padding: 0.9rem 1.5rem; /* Tăng padding nút */
  cursor: pointer;
  background-color: hsla(160, 100%, 37%, 1); /* Màu xanh lá cây chủ đạo */
  color: white;
  border: none;
  border-radius: 8px; /* Bo góc nút */
  font-size: 1.1em; /* Chữ to hơn */
  font-weight: 600; /* Đậm hơn */
  transition: background-color 0.3s ease, transform 0.1s ease;
}

.submit-button:hover:not(:disabled) {
  background-color: hsla(160, 100%, 30%, 1); /* Màu đậm hơn khi hover */
  transform: translateY(-1px); /* Hiệu ứng nhấc nhẹ */
}

.submit-button:active:not(:disabled) {
    transform: translateY(0px); /* Hiệu ứng nhấn xuống */
}

.submit-button:disabled {
  background-color: hsla(160, 50%, 50%, 0.7); /* Màu nhạt hơn khi bị disable */
  cursor: not-allowed;
}

/* Style cho thông báo lỗi */
.error-message {
  color: #dc3545; /* Màu đỏ rõ hơn */
  background-color: rgba(220, 53, 69, 0.05); /* Nền đỏ nhẹ */
  border: 1px solid rgba(220, 53, 69, 0.2);
  border-radius: 6px;
  padding: 0.8rem 1rem; /* Thêm padding */
  margin-bottom: 1.5rem; /* Khoảng cách dưới */
  font-size: 0.9em;
  text-align: center;
}

/* Style cho phần text chuyển form */
.switch-form-text {
  margin-top: 1.8rem; /* Tăng khoảng cách trên */
  font-size: 0.9em;
  text-align: center;
  color: var(--color-text-light-2);
}
.switch-form-text a {
  color: hsla(160, 100%, 37%, 1); /* Màu link */
  font-weight: 600;
  text-decoration: none; /* Bỏ gạch chân */
}
.switch-form-text a:hover {
  text-decoration: underline; /* Thêm gạch chân khi hover */
}
/* --- Kết thúc Style mới --- */
</style>