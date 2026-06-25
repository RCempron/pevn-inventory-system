<script setup>
import { ref } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'

const loginForm = ref({ username: '', password: '' })
const API_URL = import.meta.env.VITE_API_URL
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)
const success = ref(false)

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
      success.value = true
      setTimeout(() => {
        emit('login-success', data.token)
      }, 600)
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
  <div class="min-h-[70vh] flex items-center justify-center">
    <div class="relative bg-white rounded-2xl px-9 pt-10 pb-8 w-full max-w-[360px] shadow-[0_8px_30px_rgba(15,76,58,0.12)] border border-[#ece6d8]">
      <!-- Top accent tab -->
      <div class="absolute -top-[3px] left-8 w-14 h-1.5 bg-amber-500 rounded-b"></div>

      <h1 class="text-center text-xl font-bold text-emerald-900 mb-1">Welcome to</h1>
      <h1 class="text-center text-xl font-bold text-emerald-900 mb-1">Inventory Wise</h1>
      <p class="text-center text-xs text-stone-500 mb-6">Sign in to manage your stock</p>

      <form @submit.prevent="login" class="flex flex-col gap-1.5">
        <label class="text-xs font-semibold text-stone-800 mt-2.5">Username</label>
        <input
          v-model="loginForm.username"
          placeholder="Enter your username"
          required
          class="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm bg-stone-50 text-stone-800 focus:outline-none focus:border-emerald-900 focus:bg-white"
        />

        <label class="text-xs font-semibold text-stone-800 mt-2.5">Password</label>
        <div class="relative flex items-center">
          <input
            v-model="loginForm.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter your password"
            required
            class="w-full px-3 py-2.5 pr-10 border border-stone-300 rounded-lg text-sm bg-stone-50 text-stone-800 focus:outline-none focus:border-emerald-900 focus:bg-white"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            :title="showPassword ? 'Hide password' : 'Show password'"
            class="absolute right-2 p-1 rounded-md text-stone-400 hover:text-emerald-900"
          >
            <component :is="showPassword ? EyeOff : Eye" :size="18" />
          </button>
        </div>

        <p v-if="error" class="text-red-600 text-xs mt-2">{{ error }}</p>
        <p v-if="success" class="text-emerald-900 text-xs font-semibold mt-2">Login successful, redirecting...</p>

        <button
          type="submit"
          :disabled="loading"
          class="mt-5 py-3 rounded-lg bg-emerald-900 text-white text-sm font-semibold transition-colors hover:bg-emerald-800 disabled:opacity-60 disabled:cursor-default disabled:hover:bg-emerald-900"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
    </div>
  </div>
</template>