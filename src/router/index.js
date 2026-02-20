import { createRouter, createWebHistory } from 'vue-router'
import { authStore } from '../stores/auth'

const routes = [
  // Públicas
  { path: '/', component: () => import('../views/client/HomeView.vue') },
  { path: '/login', component: () => import('../views/auth/LoginView.vue') },
  { path: '/register', component: () => import('../views/auth/RegisterView.vue') },
  { path: '/products/:id', component: () => import('../views/client/ProductDetailView.vue') },

  // CLIENT
  {
    path: '/my-orders',
    component: () => import('../views/client/MyOrdersView.vue'),
    meta: { requiresAuth: true, role: 'CLIENT' }
  },

  // ADMIN
  {
    path: '/admin/products',
    component: () => import('../views/admin/AdminProductsView.vue'),
    meta: { requiresAuth: true, role: 'ADMIN' }
  },
  {
    path: '/admin/categories',
    component: () => import('../views/admin/AdminCategoriesView.vue'),
    meta: { requiresAuth: true, role: 'ADMIN' }
  },
  {
    path: '/admin/orders',
    component: () => import('../views/admin/AdminOrdersView.vue'),
    meta: { requiresAuth: true, role: 'ADMIN' }
  },
  {
    path: '/cart',
    component: () => import('../views/client/CartView.vue'),
    meta: { requiresAuth: true, role: 'CLIENT' }
  },

  // 404
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de navegación
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !authStore.isAuthenticated()) {
    next('/login')
  } else if (to.meta.role === 'ADMIN' && !authStore.isAdmin()) {
    next('/')
  } else if (to.meta.role === 'CLIENT' && !authStore.isClient()) {
    next('/')
  } else {
    next()
  }
})

export default router