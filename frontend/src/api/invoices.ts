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

  /**
   * Triggers a PDF download in the browser using a hidden anchor element.
   * Uses the authenticated endpoint (Bearer token in header).
   */
  downloadPdf: async (id: string, filename: string): Promise<void> => {
    const res = await apiClient.get(`/invoices/${id}/pdf`, { responseType: 'blob' })
    const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
    const a   = document.createElement('a')
    a.href     = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  },
}
