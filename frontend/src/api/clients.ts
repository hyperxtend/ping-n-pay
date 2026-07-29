import apiClient from './client'
import type { Client, ClientRequest } from '../types/client'

export const clientsApi = {
  list: async (): Promise<Client[]> => {
    const res = await apiClient.get<Client[]>('/clients')
    return res.data
  },

  get: async (id: string): Promise<Client> => {
    const res = await apiClient.get<Client>(`/clients/${id}`)
    return res.data
  },

  create: async (data: ClientRequest): Promise<Client> => {
    const res = await apiClient.post<Client>('/clients', data)
    return res.data
  },

  update: async (id: string, data: ClientRequest): Promise<Client> => {
    const res = await apiClient.put<Client>(`/clients/${id}`, data)
    return res.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/clients/${id}`)
  },
}
