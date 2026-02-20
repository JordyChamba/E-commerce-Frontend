<!-- src/views/admin/AdminCategoriesView.vue -->
<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Gestión de Categorías</h1>
      <button @click="openModal()" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
        + Nueva categoría
      </button>
    </div>

    <div class="bg-white rounded-2xl shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            <th class="px-6 py-3 text-left">ID</th>
            <th class="px-6 py-3 text-left">Nombre</th>
            <th class="px-6 py-3 text-left">Descripción</th>
            <th class="px-6 py-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="cat in categories" :key="cat.id" class="hover:bg-gray-50">
            <td class="px-6 py-3 text-gray-400">{{ cat.id }}</td>
            <td class="px-6 py-3 font-medium text-gray-800">{{ cat.name }}</td>
            <td class="px-6 py-3 text-gray-500">{{ cat.description }}</td>
            <td class="px-6 py-3 flex gap-2">
              <button @click="openModal(cat)" class="text-indigo-600 hover:underline text-xs">Editar</button>
              <button @click="deleteCategory(cat.id)" class="text-red-500 hover:underline text-xs">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 class="text-lg font-bold mb-4">{{ editing ? 'Editar' : 'Nueva' }} Categoría</h2>
        <form @submit.prevent="saveCategory" class="space-y-3">
          <input v-model="form.name" placeholder="Nombre" required
            class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <textarea v-model="form.description" placeholder="Descripción"
            class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
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
import { categoriesApi } from '../../api/categories'

const categories = ref([])
const showModal = ref(false)
const editing = ref(null)
const error = ref('')
const form = reactive({ name: '', description: '' })

const fetchCategories = async () => {
  const res = await categoriesApi.getAll()
  categories.value = res.data
}

const openModal = (cat = null) => {
  error.value = ''
  if (cat) {
    editing.value = cat.id
    Object.assign(form, { name: cat.name, description: cat.description })
  } else {
    editing.value = null
    Object.assign(form, { name: '', description: '' })
  }
  showModal.value = true
}

const saveCategory = async () => {
  error.value = ''
  try {
    if (editing.value) {
      await categoriesApi.update(editing.value, form)
    } else {
      await categoriesApi.create(form)
    }
    showModal.value = false
    fetchCategories()
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al guardar'
  }
}

const deleteCategory = async (id) => {
  if (!confirm('¿Eliminar esta categoría?')) return
  await categoriesApi.delete(id)
  fetchCategories()
}

onMounted(fetchCategories)
</script>