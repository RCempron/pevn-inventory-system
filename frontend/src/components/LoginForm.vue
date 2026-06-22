<script setup>
import { ref } from 'vue'

const loginForm = ref({ username: '', password: '' })
const API_URL = 'http://192.168.254.106:3000'
const error = ref('')
const loading = ref(false)

const emit = defineEmits(['login-success'])

async function login() {
  error.value = ''
  loading.value = true
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm.value)
    })
    const data = await response.json()
    if (data.token) {
      emit('login-success', data.token)
    } else {
      error.value = data.error || 'Login failed'
    }
  } catch (err) {
    error.value = 'Could not reach the server'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-wrap">
    <div class="login-card">
      <div class="login-tab"></div>
      <div class="login-brand">📦</div>
      <h1 class="login-title">My Inventory</h1>
      <p class="login-subtitle">Sign in to manage your stock</p>

      <form @submit.prevent="login" class="login-form">
        <label class="field-label">Username</label>
        <input v-model="loginForm.username" placeholder="Enter your username" required />

        <label class="field-label">Password</label>
        <input v-model="loginForm.password" type="password" placeholder="Enter your password" required />

        <p v-if="error" class="login-error">{{ error }}</p>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-wrap {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  position: relative;
  background: #ffffff;
  border-radius: 16px;
  padding: 40px 36px 32px;
  width: 100%;
  max-width: 360px;
  box-shadow: 0 8px 30px rgba(15, 76, 58, 0.12);
  border: 1px solid #ece6d8;
}

.login-tab {
  position: absolute;
  top: -3px;
  left: 32px;
  width: 56px;
  height: 6px;
  background: #d4a24c;
  border-radius: 0 0 4px 4px;
}

.login-brand {
  font-size: 32px;
  text-align: center;
  margin-bottom: 4px;
}

.login-title {
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  color: #0f4c3a;
  margin: 0 0 4px;
}

.login-subtitle {
  text-align: center;
  font-size: 13px;
  color: #8a8378;
  margin: 0 0 24px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 12px;
  font-weight: 600;
  color: #2b2b2b;
  margin-top: 10px;
}

input {
  padding: 10px 12px;
  border: 1px solid #e0dace;
  border-radius: 8px;
  font-size: 14px;
  background: #faf7f0;
  color: #2b2b2b;
}

input:focus {
  outline: none;
  border-color: #0f4c3a;
  background: #ffffff;
}

.login-error {
  color: #c0392b;
  font-size: 13px;
  margin: 8px 0 0;
}

button {
  margin-top: 20px;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #0f4c3a;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}

button:hover:not(:disabled) {
  background: #0c3c2e;
}

button:disabled {
  opacity: 0.6;
  cursor: default;
}
</style>