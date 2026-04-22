import { apiClient } from '../api/apiClient'

/**
 * Repositorio de autenticación: acceso directo a los endpoints de la API.
 * No contiene lógica de negocio; sólo mapea peticiones HTTP a funciones.
 */
export const authRepository = {
  /**
   * Inicia sesión con email, password y restaurantId.
   * @param {{ email: string, password: string, restaurantId: string }} credentials
   * @returns {Promise<{ accessToken: string, user: object }>}
   */
  login({ email, password, restaurantId }) {
    return apiClient.post('/api/auth/login', { email, password, restaurantId })
  },

  /**
   * Registra un nuevo usuario.
   * @param {{ email: string, password: string, restaurantId: string }} data
   * @returns {Promise<{ accessToken: string, user: object }>}
   */
  register({ email, password, restaurantId }) {
    return apiClient.post('/api/auth/clientRegister', { email, password, restaurantId })
  },
}
