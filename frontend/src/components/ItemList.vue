<script setup>
import { ref } from 'vue'

const props = defineProps(['items', 'token'])
const emit = defineEmits(['item-changed'])

const API_URL = 'http://192.168.254.106:3000'
const editingItem = ref(null)

function startEdit(item) {
  editingItem.value = { ...item }
}

async function deleteItem(id) {
  await fetch(`${API_URL}/items/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${props.token}` }
  })
  emit('item-changed')
}

async function updateItem() {
  await fetch(`${API_URL}/items/${editingItem.value.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${props.token}`
    },
    body: JSON.stringify(editingItem.value)
  })
  editingItem.value = null
  emit('item-changed')
}
</script>

<template>
  <ul class="item-list">
    <li v-for="item in props.items" :key="item.id" class="item-row">
      <div v-if="editingItem && editingItem.id === item.id" class="form form-inline">
        <input v-model="editingItem.name" />
        <input v-model.number="editingItem.quantity" type="number" />
        <input v-model.number="editingItem.price" type="number" step="0.01" />
        <button @click="updateItem" class="btn-save">Save</button>
        <button @click="editingItem = null" class="btn-cancel">Cancel</button>
      </div>
      <div v-else class="item-display">
        <span class="item-name">{{ item.name }}</span>
        <span class="item-detail">Qty: {{ item.quantity }}</span>
        <span class="item-detail">₱{{ item.price }}</span>
        <span class="item-actions">
          <button @click="startEdit(item)" class="btn-edit">Edit</button>
          <button @click="deleteItem(item.id)" class="btn-delete">Delete</button>
        </span>
      </div>
    </li>
  </ul>
</template>

<style scoped>
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
  font-weight: 500;
  color: white;
}
.btn-save {
  background: #2563eb;
}
.btn-cancel {
  background: #6b7280;
}
.btn-edit {
  background: #2563eb;
}
.btn-delete {
  background: #dc2626;
}
.item-list {
  list-style: none;
  padding: 0;
}
.item-row {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 10px;
}
.item-display {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.item-name {
  font-weight: 600;
  flex: 1;
}
.item-detail {
  color: #4b5563;
  font-size: 14px;
}
.item-actions {
  display: flex;
  gap: 8px;
}
</style>