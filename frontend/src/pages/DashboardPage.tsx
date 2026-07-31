import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { invoicesApi } from '../api/invoices'
import InvoiceStatusBadge from '../components/InvoiceStatusBadge'

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(amount)
}

export default function DashboardPage() {
  const { data: invoices } = useQuery({ queryKey: ['invoices'], queryFn: invoicesApi.list })

  const outstanding = invoices?.filter((i) => ['SENT', 'PARTIALLY_PAID'].includes(i.status)) ?? []
  const overdue     = invoices?.filter((i) => i.status === 'OVERDUE') ?? []
  const paidTotal   = invoices?.filter((i) => i.status === 'PAID').reduce((s, i) => s + i.total, 0) ?? 0

  return (
    <div className="px-8 py-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Outstanding</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{outstanding.length}</p>
          <p className="text-xs text-gray-400 mt-1">invoices awaiting payment</p>
        </div>
        <div className="bg-white border border-red-200 rounded-xl p-5">
          <p className="text-sm text-red-500">Overdue</p>
          <p className="mt-1 text-2xl font-semibold text-red-600">{overdue.length}</p>
          <p className="text-xs text-gray-400 mt-1">need immediate attention</p>
        </div>
        <div className="bg-white border border-green-200 rounded-xl p-5">
          <p className="text-sm text-green-600">Paid (all time)</p>
          <p className="mt-1 text-2xl font-semibold text-green-700">
            {formatCurrency(paidTotal, 'GBP')}
          </p>
          <p className="text-xs text-gray-400 mt-1">total collected</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-700">Recent invoices</h2>
          <Link to="/invoices" className="text-sm text-brand-600 hover:text-brand-700">View all</Link>
        </div>
        {invoices && invoices.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <tbody>
              {invoices.slice(0, 5).map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900 w-28">{inv.number}</td>
                  <td className="px-5 py-3 text-gray-700">{inv.clientName}</td>
                  <td className="px-5 py-3"><InvoiceStatusBadge status={inv.status} /></td>
                  <td className="px-5 py-3 text-right font-medium text-gray-900">
                    {formatCurrency(inv.total, inv.currency)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link to={`/invoices/${inv.id}`} className="text-brand-600 hover:text-brand-700">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">No invoices yet.</p>
            <Link to="/invoices/new" className="mt-2 inline-block text-sm text-brand-600 font-medium hover:text-brand-700">
              Create your first invoice →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
