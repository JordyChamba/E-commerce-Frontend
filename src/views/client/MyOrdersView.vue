<!-- src/views/client/MyOrdersView.vue -->
<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Mis Órdenes</h1>

    <div v-if="loading" class="text-center text-gray-400 py-20">Cargando...</div>

    <div v-else-if="orders.length === 0" class="text-center text-gray-400 py-20">
      No tienes órdenes aún.
      <RouterLink to="/" class="text-indigo-600 hover:underline ml-1">Ver productos</RouterLink>
    </div>

    <div v-else class="space-y-4">
      <div v-for="order in orders" :key="order.id" class="bg-white rounded-2xl shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <div>
            <span class="font-bold text-gray-800">Orden #{{ order.id }}</span>
            <span class="text-gray-400 text-sm ml-3">{{ formatDate(order.createdAt) }}</span>
          </div>
          <div class="flex items-center gap-4">
            <span :class="statusClass(order.status)" class="px-3 py-1 rounded-full text-xs font-medium">
              {{ order.status }}
            </span>
            <span class="text-indigo-600 font-bold">${{ order.total }}</span>
          </div>
        </div>

        <!-- Items de la orden -->
        <div class="border-t pt-4 space-y-2">
          <div v-for="item in order.items" :key="item.id" class="flex justify-between text-sm text-gray-600">
            <span>{{ item.productName }} x{{ item.quantity }}</span>
            <span>${{ item.subtotal }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ordersApi } from '../../api/orders'

const orders = ref([])
const loading = ref(false)

const fetchOrders = async () => {
  loading.value = true
  try {
    const res = await ordersApi.getMyOrders({ page: 0, size: 100 })
    orders.value = res.data.content
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const statusClass = (status) => {
  const map = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    SHIPPED: 'bg-purple-100 text-purple-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700'
  }
  return map[status] || 'bg-gray-100 text-gray-700'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES')
}

onMounted(fetchOrders)
</script>