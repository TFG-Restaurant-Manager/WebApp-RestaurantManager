import { apiClient } from '@/api/apiClient.js'

/**
 * Repositorio de autenticación.
 * Responsabilidad única: comunicarse con los endpoints de auth de la API.
 * No contiene lógica de negocio.
 */
export const authRepository = {
  /**
   * Inicia sesión con código de empleado y contraseña.
   * @param {{ code: string, password: string }} credentials
   * @returns {Promise<object>} respuesta del servidor (incluye al menos subscriptionId de PayPal)
   */
  login(credentials) {
    return apiClient.post('/api/restaurant', credentials)
  },

  /**
   * Cierra la sesión del usuario actual.
   * @returns {Promise<void>}
   */
  logout() {
    return apiClient.post('/auth/logout')
  },

  /**
   * Devuelve el usuario autenticado actualmente (valida el token).
   * @returns {Promise<{ user: object }>}
   */
  me() {
    return apiClient.get('/auth/me')
  },
}
