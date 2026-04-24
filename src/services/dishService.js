import { dishRepository } from '../repositories/dishRepository'

export const dishService = {
  getDishes: (restaurantId) => dishRepository.getAll(restaurantId),
  getCategories: (restaurantId) => dishRepository.getCategories(restaurantId),
}
