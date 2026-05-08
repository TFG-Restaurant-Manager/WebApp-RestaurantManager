import { authRepository } from '@/repository/authRepository.js'

export const authService = {
  async login(credentials) {
    return authRepository.login(credentials)
  },
}
