import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { invoicesApi } from '../api/invoices'
import InvoiceStatusBadge from '../components/InvoiceStatusBadge'
import type { InvoiceStatus } from '../types/invoice'

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(amount)
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date))
}

const NEXT_ACTIONS: Partial<Record<InvoiceStatus, { label: string; status: InvoiceStatus }[]>> = {
  DRAFT:          [{ label: 'Mark as sent', status: 'SENT' }, { label: 'Void', status: 'VOID' }],
  SENT:           [{ label: 'Mark paid', status: 'PAID' }, { label: 'Mark partly paid', status: 'PARTIALLY_PAID' }, { label: 'Void', status: 'VOID' }],
  PARTIALLY_PAID: [{ label: 'Mark paid', status: 'PAID' }, { label: 'Void', status: 'VOID' }],
  OVERDUE:        [{ label: 'Mark paid', status: 'PAID' }, { label: 'Void', status: 'VOID' }],
}

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: invoice, isLoading } = useQuery({
    queryKey: ['invoices', id],
    queryFn: () => invoicesApi.get(id!),
    enabled: !!id,
  })

  const { mutate: changeStatus } = useMutation({
    mutationFn: (status: InvoiceStatus) => invoicesApi.updateStatus(id!, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  })

  const { mutate: deleteInvoice } = useMutation({
    mutationFn: () => invoicesApi.delete(id!),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['invoices'] }); navigate('/invoices') },
  })

  if (isLoading || !invoice) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-600" /></div>
  }

  const actions = NEXT_ACTIONS[invoice.status] ?? []

  return (
    <div className="px-8 py-8 max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/invoices" className="hover:text-gray-900">Invoices</Link>
        <span>/</span>
        <span className="text-gray-900">{invoice.number}</span>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{invoice.number}</h1>
          <div className="mt-1"><InvoiceStatusBadge status={invoice.status} /></div>
        </div>
        <div className="flex gap-2">
          {actions.map((action) => (
            <button
              key={action.status}
              onClick={() => changeStatus(action.status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                action.status === 'VOID'
                  ? 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  : 'border-brand-600 text-brand-600 hover:bg-brand-50'
              }`}
            >
              {action.label}
            </button>
          ))}
          {invoice.status === 'DRAFT' && (
            <button
              onClick={() => { if (confirm('Delete this invoice?')) deleteInvoice() }}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        {/* Header */}
        <div className="grid grid-cols-2 gap-6 pb-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Bill to</p>
            <p className="font-medium text-gray-900">{invoice.client.name}</p>
            <p className="text-sm text-gray-600">{invoice.client.email}</p>
            {invoice.client.phone && <p className="text-sm text-gray-500">{invoice.client.phone}</p>}
            {invoice.client.address && <p className="text-sm text-gray-500">{invoice.client.address}</p>}
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Dates</p>
            <p className="text-sm text-gray-700"><span className="text-gray-400">Issued </span>{formatDate(invoice.issueDate)}</p>
            <p className="text-sm text-gray-700"><span className="text-gray-400">Due </span>{formatDate(invoice.dueDate)}</p>
          </div>
        </div>

        {/* Line items */}
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
              <th className="pb-2 text-left">Description</th>
              <th className="pb-2 text-right">Qty</th>
              <th className="pb-2 text-right">Price</th>
              <th className="pb-2 text-right">Tax</th>
              <th className="pb-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td className="py-2 text-gray-800">{item.description}</td>
                <td className="py-2 text-right text-gray-600">{item.quantity}</td>
                <td className="py-2 text-right text-gray-600">{formatCurrency(item.unitPrice, invoice.currency)}</td>
                <td className="py-2 text-right text-gray-500">{item.taxRate}%</td>
                <td className="py-2 text-right font-medium text-gray-900">{formatCurrency(item.amount, invoice.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="border-t border-gray-100 pt-4 space-y-1 text-sm">
          <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatCurrency(invoice.subtotal, invoice.currency)}</span></div>
          <div className="flex justify-between text-gray-600"><span>Tax</span><span>{formatCurrency(invoice.taxAmount, invoice.currency)}</span></div>
          {invoice.discountAmount > 0 && (
            <div className="flex justify-between text-gray-600"><span>Discount</span><span>−{formatCurrency(invoice.discountAmount, invoice.currency)}</span></div>
          )}
          <div className="flex justify-between font-semibold text-gray-900 text-base pt-2 border-t border-gray-200">
            <span>Total</span><span>{formatCurrency(invoice.total, invoice.currency)}</span>
          </div>
        </div>

        {invoice.notes && (
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Notes</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
