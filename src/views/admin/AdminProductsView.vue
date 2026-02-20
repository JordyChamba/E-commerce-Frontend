<!-- src/views/admin/AdminProductsView.vue -->
<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Gestión de Productos</h1>
      <button @click="openModal()" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
        + Nuevo producto
      </button>
    </div>

    <!-- Tabla -->
    <div class="bg-white rounded-2xl shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            <th class="px-6 py-3 text-left">Imagen</th>
            <th class="px-6 py-3 text-left">Nombre</th>
            <th class="px-6 py-3 text-left">Categoría</th>
            <th class="px-6 py-3 text-left">Precio</th>
            <th class="px-6 py-3 text-left">Stock</th>
            <th class="px-6 py-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50">
            <td class="px-6 py-3">
              <img :src="product.imageUrl" class="w-12 h-12 object-cover rounded-lg" />
            </td>
            <td class="px-6 py-3 font-medium text-gray-800">{{ product.name }}</td>
            <td class="px-6 py-3 text-gray-500">{{ product.category?.name }}</td>
            <td class="px-6 py-3 text-indigo-600 font-semibold">${{ product.price }}</td>
            <td class="px-6 py-3">
              <span :class="product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                class="px-2 py-1 rounded-full text-xs font-medium">
                {{ product.stock }}
              </span>
            </td>
            <td class="px-6 py-3 flex gap-2">
              <button @click="openModal(product)" class="text-indigo-600 hover:underline text-xs">Editar</button>
              <button @click="deleteProduct(product.id)" class="text-red-500 hover:underline text-xs">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 class="text-lg font-bold mb-4">{{ editing ? 'Editar' : 'Nuevo' }} Producto</h2>
        <form @submit.prevent="saveProduct" class="space-y-3">
          <input v-model="form.name" placeholder="Nombre" required
            class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <textarea v-model="form.description" placeholder="Descripción"
            class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input v-model="form.price" type="number" step="0.01" placeholder="Precio" required
            class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input v-model="form.stock" type="number" placeholder="Stock" required
            class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input v-model="form.imageUrl" placeholder="URL de imagen"
            class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <select v-model="form.categoryId" required
            class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Selecciona categoría</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
          <p v-if="error" class="text-red-500 text-xs">{{ error }}</p>
          <div class="flex gap-2 pt-2">
            <button type="submit" class="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 text-sm">
              {{ editing ? 'Actualizar' : 'Crear' }}
            </button>
            <button type="button" @click="showModal = false" class="flex-1 border py-2 rounded-lg text-sm hover:bg-gray-50">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { productsApi } from '../../api/products'
import { categoriesApi } from '../../api/categories'

const products = ref([])
const categories = ref([])
const showModal = ref(false)
const editing = ref(null)
const error = ref('')

const form = reactive({
  name: '', description: '', price: '', stock: '', imageUrl: '', categoryId: ''
})

const fetchProducts = async () => {
  const res = await productsApi.getAll({ page: 0, size: 100 })
  products.value = res.data.content
}

const fetchCategories = async () => {
  const res = await categoriesApi.getAll()
  categories.value = res.data
}

const openModal = (product = null) => {
  error.value = ''
  if (product) {
    editing.value = product.id
    Object.assign(form, {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl,
      categoryId: product.category?.id
    })
  } else {
    editing.value = null
    Object.assign(form, { name: '', description: '', price: '', stock: '', imageUrl: '', categoryId: '' })
  }
  showModal.value = true
}

const saveProduct = async () => {
  error.value = ''
  try {
    if (editing.value) {
      await productsApi.update(editing.value, form)
    } else {
      await productsApi.create(form)
    }
    showModal.value = false
    fetchProducts()
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al guardar'
  }
}

const deleteProduct = async (id) => {
  if (!confirm('¿Eliminar este producto?')) return
  await productsApi.delete(id)
  fetchProducts()
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>