<script setup>
import { ref, onMounted } from 'vue'
import LoginForm from './components/LoginForm.vue'
import ItemForm from './components/ItemForm.vue'
import ItemList from './components/ItemList.vue'

const items = ref([])
const token = ref('')
const API_URL = 'http://192.168.254.106:3000'

function handleLoginSuccess(receivedToken) {
  token.value = receivedToken
}

async function fetchItems() {
  const response = await fetch(`${API_URL}/items`)
  const data = await response.json()
  items.value = data
}

onMounted(() => {
  fetchItems()
})
</script>

<template>
  <div class="page">
    <h1 class="title">📦 My Inventory</h1>

    <LoginForm v-if="!token" @login-success="handleLoginSuccess" />

    <ItemForm v-else :token="token" @item-added="fetchItems" />

    <ItemList :items="items" :token="token" @item-changed="fetchItems" />
  </div>
</template>

<style scoped>
.page {
  max-width: 600px;
  margin: 40px auto;
  padding: 24px;
  font-family: 'Segoe UI', sans-serif;
  color: #1f2937;
}
.title {
  text-align: center;
  margin-bottom: 24px;
}
</style>