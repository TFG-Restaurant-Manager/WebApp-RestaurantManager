/**
 * Cliente HTTP base que envuelve fetch.
 * La URL base se lee de la variable de entorno VITE_API_BASE_URL (definida en .env).
 * Todas las peticiones envían/reciben JSON por defecto.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

/**
 * Realiza una petición HTTP genérica.
 * @param {string} path Ruta relativa al BASE_URL (ej: '/auth/login')
 * @param {{ method?: string, body?: unknown, headers?: Record<string,string> }} [options]
 * @returns {Promise<unknown>} Cuerpo de la respuesta parseado como JSON
 * @throws {Error} Error con el mensaje del servidor o HTTP status si la respuesta no es ok
 */
async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    credentials: 'include', 
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body != null ? JSON.stringify(body) : undefined,
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    const message = data?.message ?? data?.error ?? `HTTP ${response.status}`
    throw new Error(message)
  }

  return data
}

export const apiClient = {
  get:    (path, opts)  => request(path, { ...opts, method: 'GET' }),
  post:   (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put:    (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  delete: (path, opts)  => request(path, { ...opts, method: 'DELETE' }),
}
