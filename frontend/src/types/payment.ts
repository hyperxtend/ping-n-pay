export type PaymentMethod = 'BANK_TRANSFER' | 'CARD' | 'CASH' | 'CHEQUE' | 'STRIPE' | 'OTHER'

export interface Payment {
  id:            string
  invoiceId:     string
  invoiceNumber: string
  amount:        number
  currency:      string
  paymentMethod: PaymentMethod
  reference?:    string
  notes?:        string
  paidAt:        string
  recordedBy?:   string
  createdAt:     string
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  BANK_TRANSFER: 'Bank Transfer',
  CARD:          'Card',
  CASH:          'Cash',
  CHEQUE:        'Cheque',
  STRIPE:        'Stripe',
  OTHER:         'Other',
}
