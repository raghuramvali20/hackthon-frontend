import { apiRequest, TOKEN_STORAGE_KEY } from '../../../shared/services/apiClient.js'
import { unwrapData } from '../../../shared/types/api.js'

function saveSession(response) {
  const { token, user } = unwrapData(response)
  if (!token || !user) throw new Error('The server did not return a valid login session.')
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
  return user
}

export const authService = {
  async login(credentials) {
    return saveSession(
      await apiRequest('/auth/login', { method: 'POST', body: credentials }),
    )
  },
  async register(details) {
    return saveSession(
      await apiRequest('/auth/register', { method: 'POST', body: details }),
    )
  },
  async getProfile() {
    return unwrapData(await apiRequest('/auth/profile'), 'user')
  },
  logout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  },
}
