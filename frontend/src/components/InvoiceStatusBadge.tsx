import type { InvoiceStatus } from '../types/invoice'
import { STATUS_LABELS, STATUS_COLOURS } from '../types/invoice'

export default function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOURS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}
