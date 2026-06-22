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
  <div class="table-card">
    <table class="item-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Quantity</th>
          <th>Price</th>
          <th class="actions-col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in props.items" :key="item.id">
          <template v-if="editingItem && editingItem.id === item.id">
            <td><input v-model="editingItem.name" /></td>
            <td><input v-model.number="editingItem.quantity" type="number" /></td>
            <td><input v-model.number="editingItem.price" type="number" step="0.01" /></td>
            <td class="actions-col">
              <button @click="updateItem" class="btn-save">Save</button>
              <button @click="editingItem = null" class="btn-cancel">Cancel</button>
            </td>
          </template>
          <template v-else>
            <td class="item-name">{{ item.name }}</td>
            <td>{{ item.quantity }}</td>
            <td>₱{{ item.price }}</td>
            <td class="actions-col">
              <button @click="startEdit(item)" class="icon-btn edit" title="Edit">✎</button>
              <button @click="deleteItem(item.id)" class="icon-btn delete" title="Delete">🗑</button>
            </td>
          </template>
        </tr>
        <tr v-if="props.items.length === 0">
          <td colspan="4" class="empty-row">No items yet. Add your first item above.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #ece6d8;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(15, 76, 58, 0.06);
}

.item-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

thead tr {
  background: #0f4c3a;
}

th {
  text-align: left;
  padding: 12px 16px;
  color: #faf7f0;
  font-weight: 600;
  font-size: 13px;
}

tbody tr {
  border-bottom: 1px solid #f0ece1;
}

tbody tr:nth-child(even) {
  background: #faf7f0;
}

td {
  padding: 12px 16px;
  color: #2b2b2b;
}

.item-name {
  font-weight: 600;
}

.actions-col {
  text-align: right;
  white-space: nowrap;
}

.icon-btn {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 15px;
  padding: 6px 8px;
  border-radius: 6px;
}

.icon-btn.edit:hover {
  background: #e6f0ec;
}

.icon-btn.delete:hover {
  background: #fbe6e3;
}

input {
  padding: 6px 8px;
  border: 1px solid #e0dace;
  border-radius: 6px;
  font-size: 13px;
  width: 100%;
}

.btn-save, .btn-cancel {
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  color: white;
  margin-left: 4px;
}

.btn-save {
  background: #0f4c3a;
}

.btn-cancel {
  background: #8a8378;
}

.empty-row {
  text-align: center;
  padding: 24px;
  color: #8a8378;
}
</style>