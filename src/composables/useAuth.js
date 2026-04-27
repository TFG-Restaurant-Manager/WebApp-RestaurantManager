import { ref } from 'vue'
import { authService } from '@/services/authService.js'

/**
 * Estado global de autenticación (singleton).
 * Todos los componentes que llamen a useAuth() comparten el mismo estado.
 */
const user = ref(null)
const loading = ref(false)
const error = ref(null)

/**
 * Composable para gestionar el estado de autenticación.
 * Expone el usuario actual, estado de carga, errores y las acciones de auth.
 */
export function useAuth() {
  /**
   * Inicia sesión con email y contraseña.
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<boolean>} true si el login fue exitoso
   */
  async function login(credentials) {
    loading.value = true
    error.value = null
    try {
      user.value = await authService.login(credentials)
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Registra un nuevo usuario.
   * @param {{ name: string, email: string, password: string }} data
   * @returns {Promise<boolean>} true si el registro fue exitoso
   */
  async function register(data) {
    loading.value = true
    error.value = null
    try {
      user.value = await authService.register(data)
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Cierra la sesión y limpia el estado.
   * @returns {Promise<void>}
   */
  async function logout() {
    loading.value = true
    error.value = null
    try {
      await authService.logout()
      user.value = null
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  /**
   * Intenta restaurar la sesión leyendo el token almacenado.
   * @returns {Promise<void>}
   */
  async function restoreSession() {
    if (authService.isAuthenticated()) {
      loading.value = true
      error.value = null
      try {
        user.value = await authService.fetchCurrentUser()
      } catch {
        user.value = null
      } finally {
        loading.value = false
      }
    }
  }

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    restoreSession,
    isAuthenticated: () => user.value !== null,
  }
}
