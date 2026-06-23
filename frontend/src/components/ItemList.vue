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
  <div class="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
    <table class="w-full text-sm">
      <thead>
        <tr class="bg-emerald-900">
          <th class="text-left px-4 py-3 text-stone-50 font-semibold text-xs">Item</th>
          <th class="text-left px-4 py-3 text-stone-50 font-semibold text-xs">Quantity</th>
          <th class="text-left px-4 py-3 text-stone-50 font-semibold text-xs">Price</th>
          <th class="text-right px-4 py-3 text-stone-50 font-semibold text-xs">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in props.items"
          :key="item.id"
          class="border-b border-stone-100 even:bg-stone-50"
        >
          <template v-if="editingItem && editingItem.id === item.id">
            <td class="px-4 py-3">
              <input v-model="editingItem.name" class="w-full px-2 py-1.5 border border-stone-300 rounded-md text-sm" />
            </td>
            <td class="px-4 py-3">
              <input v-model.number="editingItem.quantity" type="number" class="w-full px-2 py-1.5 border border-stone-300 rounded-md text-sm" />
            </td>
            <td class="px-4 py-3">
              <input v-model.number="editingItem.price" type="number" step="0.01" class="w-full px-2 py-1.5 border border-stone-300 rounded-md text-sm" />
            </td>
            <td class="px-4 py-3 text-right whitespace-nowrap">
              <button @click="updateItem" class="px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-800 mr-1">Save</button>
              <button @click="editingItem = null" class="px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-stone-400 hover:bg-stone-500">Cancel</button>
            </td>
          </template>
          <template v-else>
            <td class="px-4 py-3 font-semibold text-stone-800">{{ item.name }}</td>
            <td class="px-4 py-3 text-stone-700">{{ item.quantity }}</td>
            <td class="px-4 py-3 text-stone-700">₱{{ item.price }}</td>
            <td class="px-4 py-3 text-right whitespace-nowrap">
              <button @click="startEdit(item)" title="Edit" class="p-1.5 rounded-md hover:bg-emerald-50 text-stone-600">✎</button>
              <button @click="deleteItem(item.id)" title="Delete" class="p-1.5 rounded-md hover:bg-red-50 text-stone-600">🗑</button>
            </td>
          </template>
        </tr>
        <tr v-if="props.items.length === 0">
          <td colspan="4" class="text-center py-8 text-stone-400">
            No items yet. Add your first item above.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>