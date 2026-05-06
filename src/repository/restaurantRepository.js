import { apiClient } from '@/api/apiClient.js'

export const restaurantRepository = {
  /**
   * Crea un restaurante junto con el empleado admin.
   * Se llama justo después de completar el pago con PayPal.
   * @param {{
   *   prefix: string,
   *   nameRestaurant: string,
   *   description: string,
   *   emailRestaurant: string,
   *   phoneRestaurant: string,
   *   address: string,
   *   nameEmployee: string,
   *   emailEmployee: string,
   *   phoneEmployee: string,
   *   code: string,
   *   password: string
   * }} payload
   * @returns {Promise<{ restaurantId: string, managerId: string }>}
   */
  create(payload) {
    return apiClient.post('restaurant', payload)
  },

  remove() {
    return apiClient.delete('restaurant')
  },
}
