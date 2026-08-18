export type Role = 'ADMIN' | 'FINANCE' | 'VIEWER'

export interface UserResponse {
  id: string
  email: string
  firstName: string
  lastName: string
  role: Role
  organisationId: string
  organisationName: string
}

export interface AuthResponse {
  accessToken?:    string
  refreshToken?:   string
  tokenType:       string
  user?:           UserResponse
  mfaRequired:     boolean
  mfaPendingToken?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  organisationName: string
}
