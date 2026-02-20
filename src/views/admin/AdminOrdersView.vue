<!-- src/views/admin/AdminOrdersView.vue -->
<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Gestión de Órdenes</h1>

    <div class="bg-white rounded-2xl shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            <th class="px-6 py-3 text-left">ID</th>
            <th class="px-6 py-3 text-left">Cliente</th>
            <th class="px-6 py-3 text-left">Total</th>
            <th class="px-6 py-3 text-left">Estado</th>
            <th class="px-6 py-3 text-left">Fecha</th>
            <th class="px-6 py-3 text-left">Cambiar estado</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
            <td class="px-6 py-3 text-gray-400">#{{ order.id }}</td>
            <td class="px-6 py-3 text-gray-800">{{ order.userEmail }}</td>
            <td class="px-6 py-3 text-indigo-600 font-semibold">${{ order.total }}</td>
            <td class="px-6 py-3">
              <span :class="statusClass(order.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                {{ order.status }}
              </span>
            </td>
            <td class="px-6 py-3 text-gray-400 text-xs">{{ formatDate(order.createdAt) }}</td>
            <td class="px-6 py-3">
              <select @change="updateStatus(order.id, $event.target.value)"
                class="border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Cambiar...</option>
                <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ordersApi } from '../../api/orders'

const orders = ref([])
const statuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']

const fetchOrders = async () => {
  const res = await ordersApi.getAll({ page: 0, size: 100 })
  orders.value = res.data.content
}

const updateStatus = async (id, status) => {
  if (!status) return
  await ordersApi.updateStatus(id, status)
  fetchOrders()
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