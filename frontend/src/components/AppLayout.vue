<!-- src/layouts/AppLayout.vue -->
<template>
  <div class="flex h-screen bg-stone-50">
    <!-- Sidebar -->
    <aside class="w-64 bg-emerald-900 text-emerald-50 flex flex-col">
      <!-- Logo -->
      <div class="h-16 flex items-center gap-2 px-6 border-b border-emerald-800">
        <span class="text-xl"></span>
        <span class="font-semibold text-lg">My Inventory</span>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-3 py-4 space-y-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="isActive(item.path)
            ? 'bg-emerald-50 text-emerald-900'
            : 'text-emerald-100 hover:bg-emerald-800'"
        >
          <span>{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <!-- Bottom: sign out -->
      <div class="px-3 py-4 border-t border-emerald-800">
        <button
          @click="handleLogout"
          class="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-100 hover:bg-emerald-800 transition-colors"
        >
          <span>↩</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>

    <!-- Main column -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Topbar -->
      <header class="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-6">
        <h1 class="text-lg font-semibold text-stone-800">{{ pageTitle }}</h1>

        <div class="flex items-center gap-4">
          <button class="text-stone-500 hover:text-stone-700">🔔</button>

          <!-- Profile dropdown -->
          <div class="relative">
            <button
              @click="showProfile = !showProfile"
              class="flex items-center gap-2"
            >
              <div class="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-semibold">
                {{ userInitial }}
              </div>
            </button>

            <div
              v-if="showProfile"
              class="absolute right-0 mt-2 w-44 bg-white border border-stone-200 rounded-lg shadow-lg py-1 z-10"
            >
              <a href="#" class="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">Profile</a>
              <a href="#" class="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">Settings</a>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter, RouterLink, RouterView } from 'vue-router'

const route = useRoute()
const router = useRouter()
const showProfile = ref(false)

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/items', label: 'Items', icon: '📦' },
  // add more as your routes grow
]

const isActive = (path) => route.path.startsWith(path)

const pageTitle = computed(() => {
  const current = navItems.find(item => isActive(item.path))
  return current ? current.label : 'Dashboard'
})

const userInitial = 'R' // swap for actual logged-in user later

function handleLogout() {
  localStorage.removeItem('token') // adjust to however you store the JWT
  router.push('/login')
}
</script>