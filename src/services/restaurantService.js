import { restaurantRepository } from '@/repository/restaurantRepository.js'

/**
 * Servicio de restaurante.
 * Contiene la lógica de negocio relacionada con el registro de restaurantes.
 * Usa restaurantRepository para las llamadas a la API.
 */
export const restaurantService = {
  /**
   * Crea un restaurante junto con el empleado admin tras completar el pago.
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
   * @returns {Promise<object>}
   */
  async create(payload) {
    return restaurantRepository.create(payload)
  },

  async remove() {
    return restaurantRepository.remove()
  },
}
