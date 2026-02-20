<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-center text-indigo-600 mb-6">Iniciar sesión</h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="tu@email.com"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {{ loading ? 'Cargando...' : 'Iniciar sesión' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-500 mt-4">
        ¿No tienes cuenta?
        <RouterLink to="/register" class="text-indigo-600 hover:underline">Regístrate</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '../../api/auth'
import { authStore as auth } from '../../stores/auth'

const router = useRouter()
const loading = ref(false)
const error = ref('')

const form = reactive({
  email: '',
  password: ''
})

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await authApi.login(form)
    const { token, email, name, role } = res.data
    auth.login({ email, name, role }, token)
    router.push(auth.isAdmin() ? '/admin/products' : '/')
  } catch (e) {
    error.value = e.response?.data?.message || 'Credenciales incorrectas'
  } finally {
    loading.value = false
  }
}
</script>