<script setup>
import { ref } from 'vue'

const loginForm = ref({ username: '', password: '' })
const API_URL = 'http://192.168.254.106:3000'

const emit = defineEmits(['login-success'])

async function login() {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginForm.value)
  })
  const data = await response.json()
  if (data.token) {
    emit('login-success', data.token)
  }
}
</script>

<template>
  <div class="card login-card">
    <h3>Login</h3>
    <form @submit.prevent="login" class="form">
      <input v-model="loginForm.username" placeholder="Username" required />
      <input v-model="loginForm.password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<style scoped>
.login-card {
  max-width: 320px;
  margin: 0 auto 24px auto;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 20px;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
input {
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}
button {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: #2563eb;
  color: white;
  font-weight: 500;
}
button:hover {
  background: #1d4ed8;
}
</style>