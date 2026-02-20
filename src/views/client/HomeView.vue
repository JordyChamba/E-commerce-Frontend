<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    
    <!-- Filtros -->
    <div class="flex gap-4 mb-8">
      <input
        v-model="filters.name"
        @input="fetchProducts"
        type="text"
        placeholder="Buscar producto..."
        class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <select
        v-model="filters.categoryId"
        @change="fetchProducts"
        class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option :value="null">Todas las categorías</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center text-gray-400 py-20">Cargando productos...</div>

    <!-- Sin productos -->
    <div v-else-if="products.length === 0" class="text-center text-gray-400 py-20">
      No hay productos disponibles
    </div>

    <!-- Grid de productos -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
      >
        <img
          :src="product.imageUrl || 'https://via.placeholder.com/300x200?text=Sin+imagen'"
          :alt="product.name"
          class="w-full h-48 object-cover"
        />
        <div class="p-4">
          <span class="text-xs text-indigo-500 font-medium">{{ product.category?.name }}</span>
          <h3 class="font-semibold text-gray-800 mt-1">{{ product.name }}</h3>
          <p class="text-gray-500 text-sm mt-1 line-clamp-2">{{ product.description }}</p>
          <div class="flex justify-between items-center mt-4">
            <span class="text-indigo-600 font-bold">${{ product.price }}</span>
            <span class="text-xs text-gray-400">Stock: {{ product.stock }}</span>
          </div>
          <RouterLink
            :to="`/products/${product.id}`"
            class="block mt-3 text-center bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition text-sm"
          >
            Ver detalle
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-10">
      <button
        v-for="page in totalPages"
        :key="page"
        @click="changePage(page - 1)"
        :class="[
          'px-4 py-2 rounded-lg text-sm',
          currentPage === page - 1
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-gray-600 border hover:bg-gray-50'
        ]"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { productsApi } from '../../api/products'
import { categoriesApi } from '../../api/categories'

const products = ref([])
const categories = ref([])
const loading = ref(false)
const currentPage = ref(0)
const totalPages = ref(0)

const filters = reactive({
  name: null,
  categoryId: null
})

const fetchProducts = async () => {
  loading.value = true
  try {
    const res = await productsApi.getAll({
      page: currentPage.value,
      size: 8,
      name: filters.name || undefined,
      categoryId: filters.categoryId || undefined
    })
    products.value = res.data.content
    totalPages.value = res.data.totalPages
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const res = await categoriesApi.getAll()
    categories.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const changePage = (page) => {
  currentPage.value = page
  fetchProducts()
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>