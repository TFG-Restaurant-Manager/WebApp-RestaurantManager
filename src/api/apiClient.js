/**
 * Cliente HTTP basado en axios.
 * Mantiene la API pública: `apiClient.get/post/put/delete`.
 * La URL base se lee de la variable de entorno VITE_API_BASE_URL.
 */
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Normalizar respuestas y errores para que coincidan con la implementación previa.
instance.interceptors.response.use(
  (response) => {
    const data = response.data === '' ? null : response.data
    return data
  },
  (error) => {
    const resp = error.response
    let message = error.message || 'Network Error'
    if (resp && resp.data) {
      const data = resp.data
      message = data?.message ?? data?.error ?? `HTTP ${resp.status}`
    }
    return Promise.reject(new Error(message))
  },
)

export const apiClient = {
  get: (path, opts = {}) => instance.get(path, { headers: opts.headers, params: opts.params }),
  post: (path, body, opts = {}) => instance.post(path, body, { headers: opts.headers }),
  put: (path, body, opts = {}) => instance.put(path, body, { headers: opts.headers }),
  delete: (path, opts = {}) => instance.delete(path, { headers: opts.headers }),
}
