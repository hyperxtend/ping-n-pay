import apiClient from './client'
import type { DashboardMetrics, AgingReport } from '../types/reporting'

export const reportsApi = {
  dashboard: async (): Promise<DashboardMetrics> => {
    const res = await apiClient.get<DashboardMetrics>('/reports/dashboard')
    return res.data
  },

  aging: async (): Promise<AgingReport> => {
    const res = await apiClient.get<AgingReport>('/reports/aging')
    return res.data
  },

  downloadCsv: () => {
    // Trigger browser download — axios can't stream file downloads cleanly
    const token = localStorage.getItem('access_token')
    const a = document.createElement('a')
    a.href = '/api/v1/reports/invoices.csv'
    a.setAttribute('download', 'invoices.csv')
    // Pass token via query param for file downloads
    const url = new URL(a.href, window.location.origin)
    // Backend reads Authorization header; for streaming downloads we fetch manually
    fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.blob())
      .then((blob) => {
        const objectUrl = URL.createObjectURL(blob)
        a.href = objectUrl
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(objectUrl)
      })
  },
}
