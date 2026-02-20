<template>
  <nav class="bg-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

      <!-- Logo -->
      <RouterLink to="/" class="text-xl font-bold text-indigo-600">
        🛒 E-Commerce
      </RouterLink>

      <!-- Links -->
      <div class="flex items-center gap-4">
        <RouterLink to="/" class="text-gray-600 hover:text-indigo-600">
          Productos
        </RouterLink>

        <!-- Solo CLIENT -->
        <template v-if="auth.isClient()">
          <RouterLink to="/my-orders" class="text-gray-600 hover:text-indigo-600">
            Mis órdenes
          </RouterLink>
          <!-- Carrito -->
          <RouterLink to="/cart" class="relative text-gray-600 hover:text-indigo-600">
            <span class="text-xl">🛒</span>
            <span v-if="cart.count > 0"
              class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {{ cart.count }}
            </span>
          </RouterLink>
        </template>

        <!-- Solo ADMIN -->
        <template v-if="auth.isAdmin()">
          <RouterLink to="/admin/products" class="text-gray-600 hover:text-indigo-600">Productos</RouterLink>
          <RouterLink to="/admin/categories" class="text-gray-600 hover:text-indigo-600">Categorías</RouterLink>
          <RouterLink to="/admin/orders" class="text-gray-600 hover:text-indigo-600">Órdenes</RouterLink>
        </template>

        <!-- No autenticado -->
        <template v-if="!auth.isAuthenticated()">
          <RouterLink to="/login" class="text-gray-600 hover:text-indigo-600">Iniciar sesión</RouterLink>
          <RouterLink to="/register" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            Registrarse
          </RouterLink>
        </template>

        <!-- Autenticado -->
        <template v-if="auth.isAuthenticated()">
          <span class="text-gray-500 text-sm">{{ auth.user?.name }}</span>
          <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
            Salir
          </button>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { authStore as auth } from '../stores/auth'
import { cartStore as cart } from '../stores/cart'
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  auth.logout()
  cart.clear()
  router.push('/login')
}
</script>