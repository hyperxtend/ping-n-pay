import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from '../api/auth'
import type { UserResponse, LoginRequest, RegisterRequest } from '../types/auth'

interface AuthContextType {
  user: UserResponse | null
  isLoading: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      authApi.getMe()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
        })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (data: LoginRequest) => {
    const response = await authApi.login(data)
    localStorage.setItem('access_token', response.accessToken)
    localStorage.setItem('refresh_token', response.refreshToken)
    setUser(response.user)
  }

  const register = async (data: RegisterRequest) => {
    const response = await authApi.register(data)
    localStorage.setItem('access_token', response.accessToken)
    localStorage.setItem('refresh_token', response.refreshToken)
    setUser(response.user)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
