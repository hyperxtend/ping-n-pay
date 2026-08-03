import apiClient from './client'
import type { NotificationChannel, NotificationRecord, NotificationRule } from '../types/notification'

export const notificationsApi = {
  // History
  list: async (): Promise<NotificationRecord[]> => {
    const res = await apiClient.get<NotificationRecord[]>('/notifications')
    return res.data
  },

  listByInvoice: async (invoiceId: string): Promise<NotificationRecord[]> => {
    const res = await apiClient.get<NotificationRecord[]>(`/notifications/invoice/${invoiceId}`)
    return res.data
  },

  ping: async (invoiceId: string, channel: NotificationChannel): Promise<void> => {
    await apiClient.post(`/notifications/invoice/${invoiceId}/ping`, null, {
      params: { channel },
    })
  },

  // Rules
  listRules: async (): Promise<NotificationRule[]> => {
    const res = await apiClient.get<NotificationRule[]>('/notification-rules')
    return res.data
  },

  createRule: async (data: {
    name: string
    triggerDaysOffset: number
    channels: NotificationChannel[]
    active?: boolean
  }): Promise<NotificationRule> => {
    const res = await apiClient.post<NotificationRule>('/notification-rules', data)
    return res.data
  },

  updateRule: async (id: string, data: {
    name: string
    triggerDaysOffset: number
    channels: NotificationChannel[]
    active?: boolean
  }): Promise<NotificationRule> => {
    const res = await apiClient.put<NotificationRule>(`/notification-rules/${id}`, data)
    return res.data
  },

  deleteRule: async (id: string): Promise<void> => {
    await apiClient.delete(`/notification-rules/${id}`)
  },
}
