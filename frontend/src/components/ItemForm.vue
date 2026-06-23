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
  <div class="bg-white border border-stone-200 rounded-xl p-5 mb-6 shadow-sm">
    <form @submit.prevent="addItem" class="flex flex-wrap items-center gap-3">
      <input
        v-model="newItem.name"
        placeholder="Item name"
        required
        class="px-3 py-2 border border-stone-300 rounded-lg text-sm flex-1 min-w-[160px] focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
      />
      <input
        v-model.number="newItem.quantity"
        type="number"
        placeholder="Quantity"
        class="px-3 py-2 border border-stone-300 rounded-lg text-sm w-28 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
      />
      <input
        v-model.number="newItem.price"
        type="number"
        placeholder="Price"
        step="0.01"
        class="px-3 py-2 border border-stone-300 rounded-lg text-sm w-28 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
      />
      <button
        type="submit"
        class="px-4 py-2 bg-emerald-900 text-white text-sm font-medium rounded-lg hover:bg-emerald-800 transition-colors"
      >
        Add Item
      </button>
    </form>
  </div>
</template>