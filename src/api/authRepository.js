import { apiClient } from '@/api/apiClient.js'

/**
 * Repositorio de autenticación.
 * Responsabilidad única: comunicarse con los endpoints de auth de la API.
 * No contiene lógica de negocio.
 */
export const authRepository = {
  /**
   * Inicia sesión con email y contraseña.
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<{ token: string, user: object }>}
   */
  login(credentials) {
    return apiClient.post('/auth/login', credentials)
  },

  /**
   * Registra un nuevo usuario.
   * @param {{ name: string, email: string, password: string }} data
   * @returns {Promise<{ token: string, user: object }>}
   */
  register(data) {
    return apiClient.post('/auth/register', data)
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
