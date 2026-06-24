<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ItemForm from '@/components/ItemForm.vue'
import ItemList from '@/components/ItemList.vue'

const items = ref([])
const token = localStorage.getItem('token')
const API_URL = 'http://192.168.254.106:3000'

let pollInterval = null

async function fetchItems() {
  const response = await fetch(`${API_URL}/items`)
  const data = await response.json()
  items.value = data
}

onMounted(() => {
  fetchItems()
  pollInterval = setInterval(fetchItems, 5000)
})

onUnmounted(() => {
  clearInterval(pollInterval)
})
</script>

<template>
  <div>
    <ItemForm :token="token" @item-added="fetchItems" />
    <ItemList :items="items" :token="token" @item-changed="fetchItems" />
  </div>
</template>