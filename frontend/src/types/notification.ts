export type NotificationChannel = 'EMAIL' | 'SMS' | 'IN_APP' | 'WHATSAPP'
export type NotificationStatus  = 'PENDING' | 'SENT' | 'FAILED' | 'SKIPPED'

export interface NotificationRule {
  id:                 string
  name:               string
  triggerDaysOffset:  number
  triggerLabel:       string
  channels:           NotificationChannel[]
  active:             boolean
  createdAt:          string
}

export interface NotificationRecord {
  id:            string
  invoiceId:     string
  invoiceNumber: string
  clientName:    string
  channel:       NotificationChannel
  recipient:     string
  status:        NotificationStatus
  scheduledAt:   string
  sentAt?:       string
  errorMessage?: string
}

export interface InAppNotificationPayload {
  notificationId: string
  invoiceId:      string
  invoiceNumber:  string
  clientName:     string
  status:         string
  total:          number
  currency:       string
  message:        string
}

export const CHANNEL_LABELS: Record<NotificationChannel, string> = {
  EMAIL:    'Email',
  SMS:      'SMS',
  IN_APP:   'In-app',
  WHATSAPP: 'WhatsApp',
}

export const STATUS_COLOURS: Record<NotificationStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  SENT:    'bg-green-100 text-green-700',
  FAILED:  'bg-red-100 text-red-700',
  SKIPPED: 'bg-gray-100 text-gray-500',
}
