<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Mi Carrito</h1>

    <div v-if="cart.items.length === 0" class="text-center text-gray-400 py-20">
      Tu carrito está vacío.
      <RouterLink to="/" class="text-indigo-600 hover:underline ml-1">Ver productos</RouterLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Items -->
      <div class="lg:col-span-2 space-y-4">
        <div v-for="item in cart.items" :key="item.productId"
          class="bg-white rounded-2xl shadow p-4 flex items-center gap-4">
          <img :src="item.imageUrl" class="w-20 h-20 object-cover rounded-xl" />
          <div class="flex-1">
            <h3 class="font-semibold text-gray-800">{{ item.name }}</h3>
            <p class="text-indigo-600 font-bold">${{ item.price }}</p>
          </div>
          <div class="flex items-center gap-2">
            <button @click="cart.updateQuantity(item.productId, item.quantity - 1)"
              class="w-8 h-8 bg-gray-100 rounded-full hover:bg-gray-200 font-bold">-</button>
            <span class="w-8 text-center">{{ item.quantity }}</span>
            <button @click="cart.updateQuantity(item.productId, item.quantity + 1)"
              class="w-8 h-8 bg-gray-100 rounded-full hover:bg-gray-200 font-bold">+</button>
          </div>
          <div class="text-right">
            <p class="font-bold text-gray-800">${{ (item.price * item.quantity).toFixed(2) }}</p>
            <button @click="cart.removeItem(item.productId)" class="text-red-400 text-xs hover:underline mt-1">
              Eliminar
            </button>
          </div>
        </div>
      </div>

      <!-- Resumen -->
      <div class="bg-white rounded-2xl shadow p-6 h-fit">
        <h2 class="font-bold text-gray-800 text-lg mb-4">Resumen</h2>
        <div class="space-y-2 text-sm text-gray-600 mb-4">
          <div class="flex justify-between" v-for="item in cart.items" :key="item.productId">
            <span>{{ item.name }} x{{ item.quantity }}</span>
            <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
        </div>
        <div class="border-t pt-4 flex justify-between font-bold text-gray-800">
          <span>Total</span>
          <span class="text-indigo-600">${{ cart.total }}</span>
        </div>
        <button @click="checkout" :disabled="loading"
          class="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition">
          {{ loading ? 'Procesando...' : 'Confirmar orden' }}
        </button>
        <p v-if="error" class="text-red-500 text-sm text-center mt-3">{{ error }}</p>
        <p v-if="success" class="text-green-600 text-sm text-center mt-3">{{ success }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { cartStore as cart } from '../../stores/cart'
import { ordersApi } from '../../api/orders'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const success = ref('')

const checkout = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    await ordersApi.create({
      items: cart.items.map(i => ({
        productId: i.productId,
        quantity: i.quantity
      }))
    })
    success.value = '¡Orden creada exitosamente!'
    cart.clear()
    setTimeout(() => router.push('/my-orders'), 1500)
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al procesar la orden'
  } finally {
    loading.value = false
  }
}
</script>