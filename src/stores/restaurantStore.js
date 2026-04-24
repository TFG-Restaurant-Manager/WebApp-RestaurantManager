/**
 * Mapa slug → restaurantId.
 * Para añadir un restaurante nuevo basta con añadir una línea aquí.
 * @type {Record<string, number>}
 */
const RESTAURANT_IDS = {
  'pizzeria-luigi':   1,
  'restaurante-pepe': 2,
}

/**
 * Devuelve el restaurantId numérico para el slug dado, o null si no existe.
 * @param {string} slug
 * @returns {number|null}
 */
export function getRestaurantId(slug) {
  return RESTAURANT_IDS[slug] ?? null
}
