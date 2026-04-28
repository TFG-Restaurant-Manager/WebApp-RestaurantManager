import { apiClient } from '@/api/apiClient.js'

export const restaurantRepository = {
  /**
   * Crea un restaurante junto con el gerente admin.
   * Se llama justo después de completar el pago con PayPal.
   * @param {{
   *   restaurant: {
   *     prefix: string,
   *     name: string,
   *     description: string,
   *     email: string,
   *     phone: string,
   *     address: string
   *   },
   *   employee: {
   *     name: string,
   *     email: string,
   *     phone: string,
   *     code: string,
   *     password: string
   *   },
   *   subscriptionId: string
   * }} payload
   * @returns {Promise<{ restaurantId: string, managerId: string }>}
   */
  create(payload) {
    return apiClient.post('/restaurants', payload)
  },
}
