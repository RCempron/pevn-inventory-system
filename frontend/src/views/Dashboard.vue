<script setup>
import { ref, onMounted, computed } from 'vue'

const items = ref([])
const API_URL = 'http://192.168.254.106:3000'
const LOW_STOCK_THRESHOLD = 10

async function fetchItems() {
  const response = await fetch(`${API_URL}/items`)
  const data = await response.json()
  items.value = data
}

onMounted(() => {
  fetchItems()
})

const totalItems = computed(() => items.value.length)

const totalValue = computed(() =>
  items.value.reduce((sum, item) => sum + item.quantity * item.price, 0)
)

const totalQuantity = computed(() =>
  items.value.reduce((sum, item) => sum + item.quantity, 0)
)

const lowStockItems = computed(() =>
  items.value.filter(item => item.quantity <= LOW_STOCK_THRESHOLD)
)
</script>

<template>
  <div class="space-y-6">
    <!-- Stat cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
        <p class="text-xs font-medium text-stone-500 mb-1">Total Items</p>
        <p class="text-2xl font-bold text-stone-800">{{ totalItems }}</p>
      </div>

      <div class="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
        <p class="text-xs font-medium text-stone-500 mb-1">Total Stock Quantity</p>
        <p class="text-2xl font-bold text-stone-800">{{ totalQuantity }}</p>
      </div>

      <div class="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
        <p class="text-xs font-medium text-stone-500 mb-1">Inventory Value</p>
        <p class="text-2xl font-bold text-stone-800">₱{{ totalValue.toFixed(2) }}</p>
      </div>

      <div class="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
        <p class="text-xs font-medium text-stone-500 mb-1">Low Stock Items</p>
        <p class="text-2xl font-bold" :class="lowStockItems.length > 0 ? 'text-red-600' : 'text-stone-800'">
          {{ lowStockItems.length }}
        </p>
      </div>
    </div>

    <!-- Low stock table -->
    <div class="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
      <div class="px-5 py-4 border-b border-stone-100">
        <h2 class="font-semibold text-stone-800">Low Stock Items</h2>
        <p class="text-xs text-stone-500 mt-0.5">Items at or below {{ LOW_STOCK_THRESHOLD }} units</p>
      </div>

      <table class="w-full text-sm">
        <thead>
          <tr class="bg-stone-50">
            <th class="text-left px-4 py-2.5 text-stone-500 font-semibold text-xs">Item</th>
            <th class="text-left px-4 py-2.5 text-stone-500 font-semibold text-xs">Quantity</th>
            <th class="text-left px-4 py-2.5 text-stone-500 font-semibold text-xs">Price</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in lowStockItems"
            :key="item.id"
            class="border-b border-stone-100"
          >
            <td class="px-4 py-3 font-medium text-stone-800">{{ item.name }}</td>
            <td class="px-4 py-3 text-red-600 font-semibold">{{ item.quantity }}</td>
            <td class="px-4 py-3 text-stone-600">₱{{ item.price }}</td>
          </tr>
          <tr v-if="lowStockItems.length === 0">
            <td colspan="3" class="text-center py-6 text-stone-400">
              All items are well stocked.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>