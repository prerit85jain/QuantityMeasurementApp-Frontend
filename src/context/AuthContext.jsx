import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('qm_token'))
  const [user, setUser]   = useState(() => localStorage.getItem('qm_user'))

  const login = useCallback((tok, username) => {
    localStorage.setItem('qm_token', tok)
    localStorage.setItem('qm_user', username || '')
    setToken(tok)
    setUser(username || '')
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('qm_token')
    localStorage.removeItem('qm_user')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
