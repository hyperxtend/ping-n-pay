import axios from 'axios'
import type { PublicInvoice } from '../types/invoice'

/**
 * Unauthenticated API client for the client portal.
 * Uses a plain axios instance (no auth interceptor).
 */
const publicClient = axios.create({ baseURL: '/api' })

export const publicApi = {
  getInvoice: (token: string): Promise<PublicInvoice> =>
    publicClient.get<PublicInvoice>(`/v1/public/invoices/${token}`).then(r => r.data),

  /** Returns a blob URL for the PDF — caller is responsible for revoking it. */
  downloadPdfUrl: (token: string) =>
    `/api/v1/public/invoices/${token}/pdf`,
}
