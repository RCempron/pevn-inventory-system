<script setup>
import { ref } from 'vue'
import { Pencil, Trash2, ShoppingCart } from 'lucide-vue-next'

const props = defineProps(['items', 'token'])
const emit = defineEmits(['item-changed'])

const API_URL = import.meta.env.VITE_API_URL
const editingItem = ref(null)
const editError = ref('')

const toast = ref({ show: false, message: '', type: 'success' })
const deleteTarget = ref(null)

const sellTarget = ref(null)       // { id, name, maxQuantity }
const sellQuantity = ref(1)
const sellError = ref('')

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 2500)
}

function startEdit(item) {
  editingItem.value = {
    ...item,
    quantity: Number(item.quantity),
    price: Number(item.price)
  }
  editError.value = ''
}

function validateEdit() {
  if (!editingItem.value.name.trim()) {
    return 'Item name is required'
  }
  if (editingItem.value.quantity < 0) {
    return 'Quantity cannot be negative'
  }
  if (editingItem.value.price <= 0) {
    return 'Price must be greater than zero'
  }
  return ''
}

function requestDelete(item) {
  deleteTarget.value = { id: item.id, name: item.name }
}

function cancelDelete() {
  deleteTarget.value = null
}

async function confirmDelete() {
  const { id, name } = deleteTarget.value
  try {
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${props.token}` }
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Delete failed')
    showToast(`"${name}" deleted`, 'success')
    emit('item-changed')
  } catch (err) {
    showToast(err.message, 'error')
  } finally {
    deleteTarget.value = null
  }
}

async function updateItem() {
  editError.value = validateEdit()
  if (editError.value) return

  try {
    const response = await fetch(`${API_URL}/items/${editingItem.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${props.token}`
      },
      body: JSON.stringify(editingItem.value)
    })
    if (!response.ok) throw new Error('Update failed')
    showToast(`"${editingItem.value.name}" updated`, 'success')
    editingItem.value = null
    emit('item-changed')
  } catch (err) {
    showToast('Failed to update item', 'error')
  }
}

function requestSell(item) {
  sellTarget.value = { id: item.id, name: item.name, maxQuantity: item.quantity }
  sellQuantity.value = 1
  sellError.value = ''
}

function cancelSell() {
  sellTarget.value = null
}

async function confirmSell() {
  if (!sellQuantity.value || sellQuantity.value <= 0) {
    sellError.value = 'Enter a quantity greater than 0'
    return
  }
  if (sellQuantity.value > sellTarget.value.maxQuantity) {
    sellError.value = `Only ${sellTarget.value.maxQuantity} in stock`
    return
  }

  try {
    const response = await fetch(`${API_URL}/sales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${props.token}`
      },
      body: JSON.stringify({
        item_id: sellTarget.value.id,
        quantity_sold: sellQuantity.value
      })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Sale failed')

    showToast(`Sold ${sellQuantity.value} × "${sellTarget.value.name}"`, 'success')
    sellTarget.value = null
    emit('item-changed')
  } catch (err) {
    sellError.value = err.message
  }
}
</script>

<template>
  <div class="relative">
    <!-- Toast -->
    <Transition name="fade">
      <div
        v-if="toast.show"
        class="fixed top-5 right-5 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white z-50"
        :class="toast.type === 'success' ? 'bg-emerald-800' : 'bg-red-600'"
      >
        {{ toast.message }}
      </div>
    </Transition>

    <!-- Delete confirmation modal -->
    <Transition name="fade">
      <div
        v-if="deleteTarget"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        @click.self="cancelDelete"
      >
        <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
          <h3 class="text-base font-semibold text-stone-800 mb-2">Delete item?</h3>
          <p class="text-sm text-stone-600 mb-6">
            Delete "<span class="font-medium text-stone-800">{{ deleteTarget.name }}</span>"? This can't be undone.
          </p>
          <div class="flex justify-end gap-2">
            <button @click="cancelDelete" class="px-4 py-2 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100">Cancel</button>
            <button @click="confirmDelete" class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700">Delete</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Sell modal -->
    <Transition name="fade">
      <div
        v-if="sellTarget"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        @click.self="cancelSell"
      >
        <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
          <h3 class="text-base font-semibold text-stone-800 mb-1">Sell "{{ sellTarget.name }}"</h3>
          <p class="text-xs text-stone-500 mb-4">{{ sellTarget.maxQuantity }} currently in stock</p>

          <label class="text-xs font-semibold text-stone-700">Quantity to sell</label>
          <input
            v-model.number="sellQuantity"
            type="number"
            min="1"
            :max="sellTarget.maxQuantity"
            class="w-full mt-1 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
          />
          <p v-if="sellError" class="text-red-600 text-xs mt-2">{{ sellError }}</p>

          <div class="flex justify-end gap-2 mt-5">
            <button @click="cancelSell" class="px-4 py-2 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100">Cancel</button>
            <button @click="confirmSell" class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-emerald-900 hover:bg-emerald-800">Confirm Sale</button>
          </div>
        </div>
      </div>
    </Transition>

    <div class="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm min-w-[520px]">
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
                  <input v-model.number="editingItem.quantity" type="number" min="0" class="w-full px-2 py-1.5 border border-stone-300 rounded-md text-sm" />
                </td>
                <td class="px-4 py-3">
                  <input v-model.number="editingItem.price" type="number" min="0.01" step="0.01" class="w-full px-2 py-1.5 border border-stone-300 rounded-md text-sm" />
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
                  <button
                    @click="requestSell(item)"
                    title="Sell"
                    :disabled="item.quantity === 0"
                    class="p-1.5 rounded-md hover:bg-amber-50 text-stone-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart :size="16" />
                  </button>
                  <button @click="startEdit(item)" title="Edit" class="p-1.5 rounded-md hover:bg-emerald-50 text-stone-600">
                    <Pencil :size="16" />
                  </button>
                  <button @click="requestDelete(item)" title="Delete" class="p-1.5 rounded-md hover:bg-red-50 text-stone-600">
                    <Trash2 :size="16" />
                  </button>
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
      <p v-if="editError" class="text-red-600 text-xs px-4 py-2">{{ editError }}</p>
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