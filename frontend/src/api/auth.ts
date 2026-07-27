import apiClient from './client'
import type { AuthResponse, LoginRequest, RegisterRequest, UserResponse } from '../types/auth'

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/login', data)
    return res.data
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/register', data)
    return res.data
  },

  getMe: async (): Promise<UserResponse> => {
    const res = await apiClient.get<UserResponse>('/users/me')
    return res.data
  },
}
