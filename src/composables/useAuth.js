import { ref } from 'vue'
import { authService } from '@/services/authService.js'

const user = ref(null)
const loading = ref(false)
const error = ref(null)

export function useAuth() {
  async function login(credentials) {
    loading.value = true
    error.value = null
    let success = false
    try {
      user.value = await authService.login(credentials)
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
    authService.logout()
    user.value = null
  }

  function setUser(data) {
    user.value = data
  }

  function isAuthenticated() {
    return user.value !== null
  }

  return {
    user,
    loading,
    error,
    login,
    logout,
    setUser,
    isAuthenticated,
  }
}
