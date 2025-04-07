<template>
  <form @submit.prevent="handleSubmit" class="auth-form">
    <h2 class="form-title">Register</h2>
    <div v-if="error" class="error-message">{{ error }}</div>

    <div class="form-group">
      <label for="register-username">Username</label>
      <input
        type="text"
        id="register-username"
        v-model="username"
        required
        placeholder="Choose a username"
      />
    </div>

    <div class="form-group">
      <label for="register-password">Password</label>
      <input
        type="password"
        id="register-password"
        v-model="password"
        required
        placeholder="Create a password"
      />
    </div>

     <div class="form-group">
       <label for="register-confirm-password">Confirm Password</label>
       <input
        type="password"
        id="register-confirm-password"
        v-model="confirmPassword"
        required
        placeholder="Confirm your password"
       />
     </div>

    <div class="form-actions">
        <button type="submit" :disabled="loading" class="submit-button">
            {{ loading ? 'Registering...' : 'Register' }}
        </button>
    </div>

     <p class="switch-form-text">
       Already have an account? <router-link to="/login">Login here</router-link>
     </p>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

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
    // Action 'auth/register' đã xử lý điều hướng
  } catch (err) {
    error.value = err.message || 'Registration failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* --- Style tương tự LoginForm --- */
.auth-form {
  max-width: 380px;
  margin: 3rem auto;
  padding: 2.5rem;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background-color: var(--color-background);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.07);
  transition: box-shadow 0.3s ease;
}
.auth-form:hover {
   box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.form-title {
  text-align: center;
  margin-top: 0;
  margin-bottom: 2rem;
  font-size: 1.8em;
  font-weight: 600;
  color: var(--color-heading);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.6rem;
  font-weight: 500;
  font-size: 0.9em;
  color: var(--color-text-light-2);
}

.form-group input {
  width: 100%;
  padding: 0.8rem 1rem;
  box-sizing: border-box;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  font-size: 1em;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-border-hover);
  box-shadow: 0 0 0 3px hsla(160, 100%, 37%, 0.1);
}

.form-actions {
    margin-top: 2rem;
}
.submit-button {
  display: block;
  width: 100%;
  padding: 0.9rem 1.5rem;
  cursor: pointer;
  background-color: hsla(160, 100%, 37%, 1);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.1s ease;
}

.submit-button:hover:not(:disabled) {
  background-color: hsla(160, 100%, 30%, 1);
  transform: translateY(-1px);
}

.submit-button:active:not(:disabled) {
    transform: translateY(0px);
}

.submit-button:disabled {
  background-color: hsla(160, 50%, 50%, 0.7);
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  background-color: rgba(220, 53, 69, 0.05);
  border: 1px solid rgba(220, 53, 69, 0.2);
  border-radius: 6px;
  padding: 0.8rem 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.9em;
  text-align: center;
}

.switch-form-text {
  margin-top: 1.8rem;
  font-size: 0.9em;
  text-align: center;
  color: var(--color-text-light-2);
}
.switch-form-text a {
  color: hsla(160, 100%, 37%, 1);
  font-weight: 600;
  text-decoration: none;
}
.switch-form-text a:hover {
  text-decoration: underline;
}
</style>