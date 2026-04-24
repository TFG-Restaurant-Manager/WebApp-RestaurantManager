import { apiClient } from '../api/apiClient'

/**
 * Repositorio de platos.
 * NOTA: Estos endpoints requieren que el backend soporte `restaurantId` como
 * parámetro público (sin JWT). Pendiente de implementación en el backend.
 */
export const dishRepository = {
  /**
   * Devuelve todos los platos de un restaurante.
   * @param {string|number} restaurantId
   * @returns {Promise<import('../types').DishesResponse[]>}
   */
  getAll: (restaurantId) =>
    apiClient.get(`/api/dish?restaurantId=${restaurantId}`),

  /**
   * Devuelve los nombres de todas las categorías de un restaurante.
   * @param {string|number} restaurantId
   * @returns {Promise<string[]>}
   */
  getCategories: (restaurantId) =>
    apiClient.get(`/api/dish/category?restaurantId=${restaurantId}`),
}
