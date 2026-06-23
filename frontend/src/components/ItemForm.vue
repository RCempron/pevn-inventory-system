<script setup>
import { ref } from 'vue'

const props = defineProps(['token'])
const emit = defineEmits(['item-added'])

const newItem = ref({ name: '', quantity: 0, price: 0 })
const API_URL = 'http://192.168.254.106:3000'
const formError = ref('')

const toast = ref({ show: false, message: '', type: 'success' })

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 2500)
}

function validate() {
  if (!newItem.value.name.trim()) {
    return 'Item name is required'
  }
  if (newItem.value.quantity < 0) {
    return 'Quantity cannot be negative'
  }
  if (newItem.value.price <= 0) {
    return 'Price must be greater than zero'
  }
  return ''
}

async function addItem() {
  formError.value = validate()
  if (formError.value) return

  try {
    const response = await fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${props.token}`
      },
      body: JSON.stringify(newItem.value)
    })
    if (!response.ok) throw new Error('Add failed')

    showToast(`"${newItem.value.name}" added`, 'success')
    newItem.value = { name: '', quantity: 0, price: 0 }
    emit('item-added')
  } catch (err) {
    showToast('Failed to add item', 'error')
  }
}
</script>

<template>
  <div class="relative">
    <Transition name="fade">
      <div
        v-if="toast.show"
        class="fixed top-5 right-5 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white z-50"
        :class="toast.type === 'success' ? 'bg-emerald-800' : 'bg-red-600'"
      >
        {{ toast.message }}
      </div>
    </Transition>

    <div class="bg-white border border-stone-200 rounded-xl p-5 mb-6 shadow-sm">
      <form @submit.prevent="addItem" class="flex flex-wrap items-start gap-3">
        <input
          v-model="newItem.name"
          placeholder="Item name"
          required
          class="px-3 py-2 border border-stone-300 rounded-lg text-sm flex-1 min-w-[160px] focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
        />
        <input
          v-model.number="newItem.quantity"
          type="number"
          min="0"
          placeholder="Quantity"
          class="px-3 py-2 border border-stone-300 rounded-lg text-sm w-28 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
        />
        <input
          v-model.number="newItem.price"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Price"
          class="px-3 py-2 border border-stone-300 rounded-lg text-sm w-28 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
        />
        <button
          type="submit"
          class="px-4 py-2 bg-emerald-900 text-white text-sm font-medium rounded-lg hover:bg-emerald-800 transition-colors"
        >
          Add Item
        </button>
      </form>
      <p v-if="formError" class="text-red-600 text-xs mt-2">{{ formError }}</p>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-from {
  opacity: 0;
}
</style>