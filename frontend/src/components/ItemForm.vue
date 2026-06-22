<script setup>
import { ref } from 'vue'

const props = defineProps(['token'])
const emit = defineEmits(['item-added'])

const newItem = ref({ name: '', quantity: 0, price: 0 })
const API_URL = 'http://192.168.254.106:3000'

async function addItem() {
  await fetch(`${API_URL}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${props.token}`
    },
    body: JSON.stringify(newItem.value)
  })
  newItem.value = { name: '', quantity: 0, price: 0 }
  emit('item-added')
}
</script>

<template>
  <div class="card">
    <form @submit.prevent="addItem" class="form form-inline">
      <input v-model="newItem.name" placeholder="Item name" required />
      <input v-model.number="newItem.quantity" type="number" placeholder="Quantity" />
      <input v-model.number="newItem.price" type="number" placeholder="Price" step="0.01" />
      <button type="submit">Add Item</button>
    </form>
  </div>
</template>

<style scoped>
.card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 24px;
}
.form-inline {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
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