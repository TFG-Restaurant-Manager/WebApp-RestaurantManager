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
    return apiClient.post('employeelogin', credentials)
  },


}
