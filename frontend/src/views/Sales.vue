<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title, Tooltip, Legend,
  BarElement, CategoryScale, LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const API_URL = 'http://192.168.254.106:3000'
const token = localStorage.getItem('token')

const summary = ref([])
const topItems = ref([])
let pollInterval = null

async function fetchSummary() {
  const response = await fetch(`${API_URL}/sales/summary`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  const data = await response.json()
  summary.value = data
}

async function fetchTopItems() {
  const response = await fetch(`${API_URL}/sales/top-items`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  const data = await response.json()
  topItems.value = data
}

async function fetchAll() {
  await Promise.all([fetchSummary(), fetchTopItems()])
}

onMounted(() => {
  fetchAll()
  pollInterval = setInterval(fetchAll, 5000)
})

onUnmounted(() => {
  clearInterval(pollInterval)
})

// Today's totals
const today = new Date().toISOString().slice(0, 10)
const todayStats = computed(() => {
  const row = summary.value.find(s => s.sale_date.slice(0, 10) === today)
  return {
    units: row ? Number(row.total_units) : 0,
    revenue: row ? Number(row.total_revenue) : 0
  }
})

// Last 7 days totals (the whole summary array IS last 7 days, per the SQL)
const weekStats = computed(() => {
  const units = summary.value.reduce((sum, row) => sum + Number(row.total_units), 0)
  const revenue = summary.value.reduce((sum, row) => sum + Number(row.total_revenue), 0)
  return { units, revenue }
})

const bestSellers = computed(() => topItems.value.slice(0, 5))
const worstSellers = computed(() => [...topItems.value].slice(-5).reverse())

// Bar chart: revenue per day, last 7 days
const dailyChartData = computed(() => ({
  labels: summary.value.map(row => new Date(row.sale_date).toLocaleDateString('en-PH', { weekday: 'short' })),
  datasets: [{
    label: 'Revenue (₱)',
    backgroundColor: '#0f4c3a',
    borderRadius: 6,
    data: summary.value.map(row => Number(row.total_revenue))
  }]
}))

const dailyChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true } }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Stat cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
        <p class="text-xs font-medium text-stone-500 mb-1">Today's Units Sold</p>
        <p class="text-2xl font-bold text-stone-800">{{ todayStats.units }}</p>
      </div>
      <div class="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
        <p class="text-xs font-medium text-stone-500 mb-1">Today's Revenue</p>
        <p class="text-2xl font-bold text-stone-800">₱{{ todayStats.revenue.toFixed(2) }}</p>
      </div>
      <div class="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
        <p class="text-xs font-medium text-stone-500 mb-1">7-Day Units Sold</p>
        <p class="text-2xl font-bold text-stone-800">{{ weekStats.units }}</p>
      </div>
      <div class="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
        <p class="text-xs font-medium text-stone-500 mb-1">7-Day Revenue</p>
        <p class="text-2xl font-bold text-stone-800">₱{{ weekStats.revenue.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Daily revenue chart -->
    <div class="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
      <h2 class="font-semibold text-stone-800 mb-1">Revenue, Last 7 Days</h2>
      <div class="h-64">
        <Bar v-if="summary.length" :data="dailyChartData" :options="dailyChartOptions" />
        <p v-else class="text-sm text-stone-400 text-center pt-20">No sales data yet</p>
      </div>
    </div>

    <!-- Best / Worst sellers -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
        <div class="px-5 py-4 border-b border-stone-100">
          <h2 class="font-semibold text-stone-800">Best Sellers</h2>
        </div>
        <table class="w-full text-sm">
          <tbody>
            <tr v-for="(item, i) in bestSellers" :key="item.item_name" class="border-b border-stone-100 last:border-0">
              <td class="px-4 py-3 font-medium text-stone-800">{{ i + 1 }}. {{ item.item_name }}</td>
              <td class="px-4 py-3 text-right text-emerald-700 font-semibold">{{ item.total_units_sold }} sold</td>
            </tr>
            <tr v-if="bestSellers.length === 0">
              <td class="px-4 py-6 text-center text-stone-400">No sales yet</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
        <div class="px-5 py-4 border-b border-stone-100">
          <h2 class="font-semibold text-stone-800">Worst Sellers</h2>
        </div>
        <table class="w-full text-sm">
          <tbody>
            <tr v-for="(item, i) in worstSellers" :key="item.item_name" class="border-b border-stone-100 last:border-0">
              <td class="px-4 py-3 font-medium text-stone-800">{{ item.item_name }}</td>
              <td class="px-4 py-3 text-right text-red-600 font-semibold">{{ item.total_units_sold }} sold</td>
            </tr>
            <tr v-if="worstSellers.length === 0">
              <td class="px-4 py-6 text-center text-stone-400">No sales yet</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>