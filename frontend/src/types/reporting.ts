export interface AgingRow {
  invoiceId:   string
  invoiceNumber: string
  clientName:  string
  daysOverdue: number
  balanceDue:  number
  currency:    string
}

export interface AgingReport {
  current:   number
  days1to30:  number
  days31to60: number
  days61to90: number
  days90plus: number
  rows:       AgingRow[]
}

export interface DashboardMetrics {
  totalInvoiced:      number
  totalCollected:     number
  totalOutstanding:   number
  overdueCount:       number
  overdueAmount:      number
  draftCount:         number
  sentCount:          number
  partiallyPaidCount: number
  paidCount:          number
  aging:              AgingReport
}
