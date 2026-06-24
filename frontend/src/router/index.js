import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/',
    component: () => import('@/components/AppLayout.vue'),
    children: [
      { path: 'dashboard', component: () => import('@/views/Dashboard.vue') },
      { path: 'items', component: () => import('@/views/Items.vue') },
    ],
  },
  {
  path: '/',
  component: () => import('@/components/AppLayout.vue'),
  children: [
    { path: 'dashboard', component: () => import('@/views/Dashboard.vue') },
    { path: 'items', component: () => import('@/views/Items.vue') },
    { path: 'sales', component: () => import('@/views/Sales.vue') },  // must be in here
  ],
}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard: block protected pages if no token
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router