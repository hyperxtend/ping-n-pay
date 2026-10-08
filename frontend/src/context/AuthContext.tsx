import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from '../api/auth'
import type { UserResponse, LoginRequest, RegisterRequest } from '../types/auth'

export interface MfaChallenge {
  mfaPendingToken: string
}

interface AuthContextType {
  user:          UserResponse | null
  isLoading:     boolean
  mfaChallenge:  MfaChallenge | null   // set when login requires MFA step-up
  login:         (data: LoginRequest) => Promise<{ mfaRequired: boolean }>
  completeMfa:   (user: UserResponse, accessToken: string, refreshToken: string) => void
  register:      (data: RegisterRequest) => Promise<void>
  logout:        () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]               = useState<UserResponse | null>(null)
  const [isLoading, setIsLoading]     = useState(true)
  const [mfaChallenge, setMfaChallenge] = useState<MfaChallenge | null>(null)

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

  const login = async (data: LoginRequest): Promise<{ mfaRequired: boolean }> => {
    const response = await authApi.login(data)

    if (response.mfaRequired && response.mfaPendingToken) {
      // Store the pending token so MfaVerifyPage can use it
      setMfaChallenge({ mfaPendingToken: response.mfaPendingToken })
      return { mfaRequired: true }
    }

    localStorage.setItem('access_token',  response.accessToken!)
    localStorage.setItem('refresh_token', response.refreshToken!)
    setUser(response.user!)
    return { mfaRequired: false }
  }

  /** Called by MfaVerifyPage after a successful /auth/mfa-verify. */
  const completeMfa = (user: UserResponse, accessToken: string, refreshToken: string) => {
    localStorage.setItem('access_token',  accessToken)
    localStorage.setItem('refresh_token', refreshToken)
    setMfaChallenge(null)
    setUser(user)
  }

  const register = async (data: RegisterRequest) => {
    const response = await authApi.register(data)
    localStorage.setItem('access_token',  response.accessToken!)
    localStorage.setItem('refresh_token', response.refreshToken!)
    setUser(response.user!)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setMfaChallenge(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, mfaChallenge, login, completeMfa, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
