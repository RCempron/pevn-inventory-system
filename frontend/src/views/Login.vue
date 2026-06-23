<script setup>
import { useRouter } from 'vue-router'
import LoginForm from '@/components/LoginForm.vue'

const router = useRouter()

function handleLoginSuccess(receivedToken) {
  localStorage.setItem('token', receivedToken)
  router.push('/dashboard')
}
</script>

<template>
  <LoginForm @login-success="handleLoginSuccess" />
</template>