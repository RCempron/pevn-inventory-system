<script setup>
import { ref, onMounted, computed } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title, Tooltip, Legend,
  BarElement, CategoryScale, LinearScale,
  ArcElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

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

// Bar chart: quantity per item
const barChartData = computed(() => ({
  labels: items.value.map(item => item.name),
  datasets: [{
    label: 'Quantity in stock',
    backgroundColor: items.value.map(item =>
      item.quantity <= LOW_STOCK_THRESHOLD ? '#dc2626' : '#0f4c3a'
    ),
    borderRadius: 6,
    data: items.value.map(item => item.quantity),
  }]
}))

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: { beginAtZero: true, ticks: { precision: 0 } }
  }
}

// Doughnut chart: value distribution (top 6 + "Other")
const doughnutChartData = computed(() => {
  const sorted = [...items.value]
    .map(item => ({ name: item.name, value: item.quantity * item.price }))
    .sort((a, b) => b.value - a.value)

  const top = sorted.slice(0, 6)
  const rest = sorted.slice(6)
  const restTotal = rest.reduce((sum, item) => sum + item.value, 0)

  const labels = top.map(item => item.name)
  const data = top.map(item => item.value)

  if (restTotal > 0) {
    labels.push('Other')
    data.push(restTotal)
  }

  const palette = ['#0f4c3a', '#d4a24c', '#2563eb', '#7c3aed', '#dc2626', '#0891b2', '#8a8378']

  return {
    labels,
    datasets: [{
      backgroundColor: palette.slice(0, labels.length),
      data,
    }]
  }
})

const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
  }
}
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

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="bg-white border border-stone-200 rounded-xl p-5 shadow-sm lg:col-span-2">
        <h2 class="font-semibold text-stone-800 mb-1">Stock by Item</h2>
        <p class="text-xs text-stone-500 mb-4">Red bars are at or below {{ LOW_STOCK_THRESHOLD }} units</p>
        <div class="h-72">
          <Bar v-if="items.length" :data="barChartData" :options="barChartOptions" />
          <p v-else class="text-sm text-stone-400 text-center pt-20">No data yet</p>
        </div>
      </div>

      <div class="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
        <h2 class="font-semibold text-stone-800 mb-1">Value Distribution</h2>
        <p class="text-xs text-stone-500 mb-4">Top items by inventory value</p>
        <div class="h-72">
          <Doughnut v-if="items.length" :data="doughnutChartData" :options="doughnutChartOptions" />
          <p v-else class="text-sm text-stone-400 text-center pt-20">No data yet</p>
        </div>
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
          <tr v-for="item in lowStockItems" :key="item.id" class="border-b border-stone-100">
            <td class="px-4 py-3 font-medium text-stone-800">{{ item.name }}</td>
            <td class="px-4 py-3 text-red-600 font-semibold">{{ item.quantity }}</td>
            <td class="px-4 py-3 text-stone-600">₱{{ item.price }}</td>
          </tr>
          <tr v-if="lowStockItems.length === 0">
            <td colspan="3" class="text-center py-6 text-stone-400">All items are well stocked.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>