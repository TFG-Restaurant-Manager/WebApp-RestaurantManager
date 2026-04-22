import { reactive, readonly } from 'vue'
import { authService } from '../services/authService'

/**
 * Estado interno del store. Al estar en el módulo (fuera de cualquier función),
 * actúa como singleton: todos los componentes que importen authStore comparten
 * exactamente el mismo objeto reactivo.
 */
const state = reactive({
  user: null,         // objeto de usuario devuelto por la API, o null
  accessToken: null,  // JWT guardado solo en memoria (nunca en localStorage)
  loading: false,
  error: null,
})

/**
 * Store de autenticación (singleton sin Pinia).
 * Expone estado de solo lectura y acciones para login, register y logout.
 */
export const authStore = {
  /** Estado reactivo de solo lectura para los componentes. */
  state: readonly(state),

  /**
   * Inicia sesión y guarda usuario + accessToken en el state.
   * @param {{ email: string, password: string, restaurantId: string }} credentials
   */
  async login({ email, password, restaurantId }) {
    state.loading = true
    state.error = null
    try {
      const data = await authService.login({ email, password, restaurantId })
      state.accessToken = data.accessToken
      state.user = data.user
    } catch (e) {
      state.error = e.message
      throw e
    } finally {
      state.loading = false
    }
  },

  /**
   * Registra una cuenta nueva y la deja iniciada.
   * @param {{ email: string, password: string, restaurantId: string }} credentials
   */
  async register({ email, password, restaurantId }) {
    state.loading = true
    state.error = null
    try {
      const data = await authService.register({ email, password, restaurantId })
      state.accessToken = data.accessToken
      state.user = data.user
    } catch (e) {
      state.error = e.message
      throw e
    } finally {
      state.loading = false
    }
  },

  /** Cierra sesión y limpia todo el estado. */
  logout() {
    state.user = null
    state.accessToken = null
    state.error = null
  },

  /** Limpia el error manualmente (p.ej. al cerrar el modal). */
  clearError() {
    state.error = null
  },
}
