<!-- src/views/client/ProductDetailView.vue -->
<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <div v-if="loading" class="text-center text-gray-400 py-20">Cargando...</div>

    <div v-else-if="product" class="bg-white rounded-2xl shadow p-8 flex gap-8">
      <!-- Imagen -->
      <div class="w-1/2">
        <img :src="product.imageUrl || 'https://via.placeholder.com/400x300?text=Sin+imagen'" :alt="product.name"
          class="w-full h-80 object-cover rounded-2xl" />
      </div>

      <!-- Info -->
      <div class="w-1/2 flex flex-col justify-between">
        <div>
          <span class="text-sm text-indigo-500 font-medium">{{ product.category?.name }}</span>
          <h1 class="text-3xl font-bold text-gray-800 mt-1">{{ product.name }}</h1>
          <p class="text-gray-500 mt-3">{{ product.description }}</p>
          <p class="text-4xl font-bold text-indigo-600 mt-6">${{ product.price }}</p>
          <p class="text-sm text-gray-400 mt-1">Stock disponible: {{ product.stock }}</p>
        </div>

        <div class="mt-6">
          <!-- Si no está logueado -->
          <div v-if="!auth.isAuthenticated()">
            <RouterLink to="/login"
              class="block text-center bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition">
              Inicia sesión para comprar
            </RouterLink>
          </div>

          <!-- Si es CLIENT -->
          <div v-else-if="auth.isClient()">
            <div class="flex items-center gap-3 mb-4">
              <label class="text-sm text-gray-600">Cantidad:</label>
              <input v-model="quantity" type="number" min="1" :max="product.stock"
                class="border rounded-lg px-3 py-2 w-20 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <button @click="addToCart" :disabled="product.stock === 0"
              class="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition mb-2">
              {{ product.stock === 0 ? 'Sin stock' : '🛒 Agregar al carrito' }}
            </button>
            <p v-if="success" class="text-green-600 text-sm text-center mt-2">{{ success }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <RouterLink to="/" class="text-indigo-600 hover:underline text-sm">← Volver al catálogo</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productsApi } from '../../api/products'
import { ordersApi } from '../../api/orders'
import { authStore as auth } from '../../stores/auth'
import { cartStore as cart } from '../../stores/cart'

const route = useRoute()
const router = useRouter()
const product = ref(null)
const loading = ref(false)
const quantity = ref(1)
const success = ref('')
const error = ref('')

const fetchProduct = async () => {
  loading.value = true
  try {
    const res = await productsApi.getById(route.params.id)
    product.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const addToCart = () => {
  cart.addItem(product.value, quantity.value)
  success.value = '¡Agregado al carrito!'
  setTimeout(() => success.value = '', 2000)
}

onMounted(fetchProduct)
</script>