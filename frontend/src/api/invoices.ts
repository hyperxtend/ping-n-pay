import apiClient from './client'
import type { Invoice, InvoiceSummary, CreateInvoiceRequest, InvoiceStatus } from '../types/invoice'

export const invoicesApi = {
  list: async (): Promise<InvoiceSummary[]> => {
    const res = await apiClient.get<InvoiceSummary[]>('/invoices')
    return res.data
  },

  get: async (id: string): Promise<Invoice> => {
    const res = await apiClient.get<Invoice>(`/invoices/${id}`)
    return res.data
  },

  create: async (data: CreateInvoiceRequest): Promise<Invoice> => {
    const res = await apiClient.post<Invoice>('/invoices', data)
    return res.data
  },

  update: async (id: string, data: Partial<CreateInvoiceRequest>): Promise<Invoice> => {
    const res = await apiClient.put<Invoice>(`/invoices/${id}`, data)
    return res.data
  },

  updateStatus: async (id: string, status: InvoiceStatus): Promise<Invoice> => {
    const res = await apiClient.patch<Invoice>(`/invoices/${id}/status`, null, {
      params: { status },
    })
    return res.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/invoices/${id}`)
  },
}
