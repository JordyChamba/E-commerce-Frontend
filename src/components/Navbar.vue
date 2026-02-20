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
        <RouterLink v-if="auth.isClient()" to="/my-orders" class="text-gray-600 hover:text-indigo-600">
          Mis órdenes
        </RouterLink>

        <!-- Solo ADMIN -->
        <template v-if="auth.isAdmin()">
          <RouterLink to="/admin/products" class="text-gray-600 hover:text-indigo-600">
            Productos
          </RouterLink>
          <RouterLink to="/admin/categories" class="text-gray-600 hover:text-indigo-600">
            Categorías
          </RouterLink>
          <RouterLink to="/admin/orders" class="text-gray-600 hover:text-indigo-600">
            Órdenes
          </RouterLink>
        </template>

        <!-- No autenticado -->
        <template v-if="!auth.isAuthenticated()">
          <RouterLink to="/login" class="text-gray-600 hover:text-indigo-600">
            Iniciar sesión
          </RouterLink>
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
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  auth.logout()
  router.push('/login')
}
</script>