import { ref } from 'vue'
import { authService } from '@/services/authService.js'

const user = ref(null)
const token = ref(null)
const loading = ref(false)
const error = ref(null)

export function useAuth() {
  async function login(credentials) {
    loading.value = true
    error.value = null
    let success = false
    try {
      const data = await authService.login(credentials)
      token.value = data?.token ?? null
      user.value = data
      success = true
    } catch (err) {
      error.value = err.message
      success = false
    } finally {
      loading.value = false
    }
    return success
  }

  function logout() {
    user.value = null
    token.value = null
  }

  function setUser(data) {
    token.value = data?.token ?? null
    user.value = data
  }

  function isAuthenticated() {
    return user.value !== null
  }

  return {
    user,
    token,
    loading,
    error,
    login,
    logout,
    setUser,
    isAuthenticated,
  }
}
