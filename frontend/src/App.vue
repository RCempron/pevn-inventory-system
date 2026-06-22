<script setup>
import { ref, onMounted } from 'vue'

const items = ref([])
const newItem = ref({ name: '', quantity: 0, price: 0 })
const token = ref('')
const loginForm = ref({ username: '', password: '' })
const API_URL = 'http://192.168.254.106:3000'

async function login() {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginForm.value)
  })
  const data = await response.json()
  if (data.token) {
    token.value = data.token
  }
}

async function fetchItems() {
  const response = await fetch(`${API_URL}/items`)
  const data = await response.json()
  items.value = data
}

async function addItem() {
  await fetch(`${API_URL}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.value}`
    },
    body: JSON.stringify(newItem.value)
  })
  newItem.value = { name: '', quantity: 0, price: 0 }
  fetchItems()
}

async function deleteItem(id) {
  await fetch(`${API_URL}/items/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token.value}`
    }
  })
  fetchItems()
}

const editingItem = ref(null)

function startEdit(item) {
  editingItem.value = { ...item }
}

async function updateItem() {
  await fetch(`${API_URL}/items/${editingItem.value.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.value}`
    },
    body: JSON.stringify(editingItem.value)
  })
  editingItem.value = null
  fetchItems()
}

onMounted(() => {
  fetchItems()
})
</script>

<template>
  <h1>My Inventory</h1>

  <div v-if="!token">
    <h3>Login</h3>
    <form @submit.prevent="login">
      <input v-model="loginForm.username" placeholder="Username" required />
      <input v-model="loginForm.password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </div>

  <div v-else>
    <form @submit.prevent="addItem">
      <input v-model="newItem.name" placeholder="Item name" required />
      <input v-model.number="newItem.quantity" type="number" placeholder="Quantity" />
      <input v-model.number="newItem.price" type="number" placeholder="Price" step="0.01" />
      <button type="submit">Add Item</button>
    </form>
  </div>

  <ul>
  <li v-for="item in items" :key="item.id">
    <div v-if="editingItem && editingItem.id === item.id">
      <input v-model="editingItem.name" />
      <input v-model.number="editingItem.quantity" type="number" />
      <input v-model.number="editingItem.price" type="number" step="0.01" />
      <button @click="updateItem">Save</button>
      <button @click="editingItem = null">Cancel</button>
    </div>
    <div v-else>
      {{ item.name }} — Qty: {{ item.quantity }} — ₱{{ item.price }}
      <button @click="startEdit(item)">Edit</button>
      <button @click="deleteItem(item.id)">Delete</button>
    </div>
  </li>
</ul>
</template>