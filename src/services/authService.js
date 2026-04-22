import { authRepository } from '../repositories/authRepository'

/**
 * Servicio de autenticación: orquesta la lógica de negocio relacionada con auth.
 * Los componentes Vue sólo deben llamar a estas funciones, nunca al repositorio directamente.
 */
export const authService = {
  /**
   * Inicia sesión y devuelve el accessToken y el usuario.
   * @param {{ email: string, password: string, restaurantId: string }} credentials
   * @returns {Promise<{ accessToken: string, user: object }>}
   */
  async login({ email, password, restaurantId }) {
    const data = await authRepository.login({ email, password, restaurantId })
    return data
  },

  /**
   * Registra un nuevo usuario y devuelve el accessToken y el usuario.
   * @param {{ email: string, password: string, restaurantId: string }} data
   * @returns {Promise<{ accessToken: string, user: object }>}
   */
  async register({ email, password, restaurantId }) {
    const data = await authRepository.register({ email, password, restaurantId })
    return data
  },
}
