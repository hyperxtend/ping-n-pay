export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'VOID'

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  taxRate: number
  amount: number
}

export interface InvoiceSummary {
  id: string
  number: string
  status: InvoiceStatus
  clientName: string
  issueDate: string
  dueDate: string
  total: number
  currency: string
}

export interface Invoice extends InvoiceSummary {
  client: {
    id: string
    name: string
    email: string
    phone?: string
    address?: string
  }
  subtotal:     number
  taxAmount:    number
  discountAmount: number
  amountPaid:   number
  balanceDue:   number
  notes?:       string
  items:        InvoiceItem[]
  createdAt:    string
  updatedAt:    string
}

export interface CreateInvoiceRequest {
  clientId: string
  issueDate: string
  dueDate: string
  currency?: string
  discountAmount?: number
  notes?: string
  items: {
    description: string
    quantity: number
    unitPrice: number
    taxRate?: number
  }[]
}

export const STATUS_LABELS: Record<InvoiceStatus, string> = {
  DRAFT:          'Draft',
  SENT:           'Sent',
  PARTIALLY_PAID: 'Partly paid',
  PAID:           'Paid',
  OVERDUE:        'Overdue',
  VOID:           'Void',
}

export const STATUS_COLOURS: Record<InvoiceStatus, string> = {
  DRAFT:          'bg-gray-100 text-gray-700',
  SENT:           'bg-blue-100 text-blue-700',
  PARTIALLY_PAID: 'bg-yellow-100 text-yellow-700',
  PAID:           'bg-green-100 text-green-700',
  OVERDUE:        'bg-red-100 text-red-700',
  VOID:           'bg-gray-100 text-gray-500',
}
