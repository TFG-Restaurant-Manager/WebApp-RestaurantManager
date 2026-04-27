import { authRepository } from '@/api/authRepository.js'

const TOKEN_KEY = 'auth_token'

/**
 * Servicio de autenticación.
 * Contiene la lógica de negocio relacionada con auth:
 * persistir el token, adjuntarlo a las peticiones, etc.
 * Usa authRepository para las llamadas a la API.
 */
export const authService = {
  /**
   * Inicia sesión, guarda el token y devuelve el usuario.
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<object>} usuario autenticado
   */
  async login(credentials) {
    const { token, user } = await authRepository.login(credentials)
    localStorage.setItem(TOKEN_KEY, token)
    return user
  },

  /**
   * Registra un nuevo usuario, guarda el token y devuelve el usuario.
   * @param {{ name: string, email: string, password: string }} data
   * @returns {Promise<object>} usuario creado
   */
  async register(data) {
    const { token, user } = await authRepository.register(data)
    localStorage.setItem(TOKEN_KEY, token)
    return user
  },

  /**
   * Cierra la sesión y elimina el token local.
   * @returns {Promise<void>}
   */
  async logout() {
    await authRepository.logout()
    localStorage.removeItem(TOKEN_KEY)
  },

  /**
   * Valida el token almacenado y devuelve el usuario actual.
   * Lanza error si no hay token o si la sesión expiró.
   * @returns {Promise<object>} usuario autenticado
   */
  async fetchCurrentUser() {
    const { user } = await authRepository.me()
    return user
  },

  /**
   * Devuelve el token almacenado, o null si no existe.
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },

  /** Indica si hay una sesión activa (token presente). */
  isAuthenticated() {
    return localStorage.getItem(TOKEN_KEY) !== null
  },
}
