<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter, RouterLink, RouterView } from 'vue-router'
import { LayoutDashboard, Package, Bell, LogOut, Menu, X, TrendingUp } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const showProfile = ref(false)
const isCollapsed = ref(false)      // desktop collapse state
const isMobileOpen = ref(false)     // mobile drawer state

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/items', label: 'Items', icon: Package },
  { path: '/sales', label: 'Sales', icon: TrendingUp },
]

const isActive = (path) => route.path.startsWith(path)

const pageTitle = computed(() => {
  const current = navItems.find(item => isActive(item.path))
  return current ? current.label : 'Dashboard'
})

const userInitial = 'R'

function handleLogout() {
  localStorage.removeItem('token')
  router.push('/login')
}

function closeMobileMenu() {
  isMobileOpen.value = false
}
</script>

<template>
  <div class="flex h-screen bg-stone-50 overflow-hidden">
    <!-- Mobile backdrop -->
    <div
      v-if="isMobileOpen"
      class="fixed inset-0 bg-black/40 z-40 md:hidden"
      @click="closeMobileMenu"
    ></div>

    <!-- Sidebar -->
    <aside
      class="bg-emerald-900 text-emerald-50 flex flex-col transition-all duration-200 fixed md:static h-full z-50"
      :class="[
        isCollapsed ? 'md:w-20' : 'md:w-64',
        isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
      ]"
    >
      <div class="h-16 flex items-center gap-2 px-4 border-b border-emerald-800" :class="isCollapsed ? 'md:justify-center' : ''">
        <button
          @click="isCollapsed = !isCollapsed"
          class="hidden md:flex p-2 rounded-lg hover:bg-emerald-800 transition-colors"
        >
          <Menu :size="20" />
        </button>
        <button
          @click="closeMobileMenu"
          class="md:hidden p-2 rounded-lg hover:bg-emerald-800 transition-colors"
        >
          <X :size="20" />
        </button>
        <span v-if="!isCollapsed" class="font-semibold text-lg whitespace-nowrap">My Inventory</span>
      </div>

      <nav class="flex-1 px-3 py-4 space-y-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :title="isCollapsed ? item.label : ''"
          @click="closeMobileMenu"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="[
            isActive(item.path) ? 'bg-emerald-50 text-emerald-900' : 'text-emerald-100 hover:bg-emerald-800',
            isCollapsed ? 'md:justify-center' : ''
          ]"
        >
          <component :is="item.icon" :size="18" />
          <span v-if="!isCollapsed">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="px-3 py-4 border-t border-emerald-800">
        <button
          @click="handleLogout"
          :title="isCollapsed ? 'Sign Out' : ''"
          class="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-100 hover:bg-emerald-800 transition-colors"
          :class="isCollapsed ? 'md:justify-center' : ''"
        >
          <LogOut :size="18" />
          <span v-if="!isCollapsed">Sign Out</span>
        </button>
      </div>
    </aside>

    <!-- Main column -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-4 md:px-6">
        <div class="flex items-center gap-3">
          <button
            @click="isMobileOpen = true"
            class="md:hidden p-2 rounded-lg hover:bg-stone-100 text-stone-600"
          >
            <Menu :size="22" />
          </button>
          <h1 class="text-lg font-semibold text-stone-800">{{ pageTitle }}</h1>
        </div>

        <div class="flex items-center gap-4">
          <button class="text-stone-500 hover:text-stone-700">
            <Bell :size="20" />
          </button>

          <div class="relative">
            <button @click="showProfile = !showProfile" class="flex items-center gap-2">
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

      <main class="flex-1 overflow-y-auto p-4 md:p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>