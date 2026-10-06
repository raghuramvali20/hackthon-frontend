import { useEffect, useMemo, useState } from 'react'
import { TOKEN_STORAGE_KEY } from '../../../shared/services/apiClient.js'
import { authService } from '../services/authService.js'

import { AuthContext } from './AuthContext.js'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(
    () => Boolean(localStorage.getItem(TOKEN_STORAGE_KEY)),
  )

  useEffect(() => {
    let active = true
    if (!localStorage.getItem(TOKEN_STORAGE_KEY)) {
      return () => { active = false }
    }

    authService
      .getProfile()
      .then((profile) => {
        if (active) setUser(profile)
      })
      .catch(() => {
        authService.logout()
        if (active) setUser(null)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => { active = false }
  }, [])

  const value = useMemo(() => ({
    user,
    isLoading,
    async login(credentials) {
      const profile = await authService.login(credentials)
      setUser(profile)
      return profile
    },
    async register(details) {
      const profile = await authService.register(details)
      setUser(profile)
      return profile
    },
    logout() {
      authService.logout()
      setUser(null)
    },
  }), [user, isLoading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
