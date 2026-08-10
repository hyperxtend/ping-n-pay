import apiClient from './client'
import type { Payment, PaymentMethod } from '../types/payment'

export const paymentsApi = {
  list: async (): Promise<Payment[]> => {
    const res = await apiClient.get<Payment[]>('/payments')
    return res.data
  },

  listByInvoice: async (invoiceId: string): Promise<Payment[]> => {
    const res = await apiClient.get<Payment[]>(`/payments/invoice/${invoiceId}`)
    return res.data
  },

  record: async (
    invoiceId: string,
    data: { amount: number; paymentMethod: PaymentMethod; reference?: string; notes?: string; paidAt?: string }
  ): Promise<Payment> => {
    const res = await apiClient.post<Payment>(`/payments/invoice/${invoiceId}`, data)
    return res.data
  },

  createStripeCheckout: async (invoiceId: string): Promise<{ checkoutUrl: string }> => {
    const res = await apiClient.post<{ checkoutUrl: string }>(
      `/payments/invoice/${invoiceId}/stripe-checkout`
    )
    return res.data
  },
}
