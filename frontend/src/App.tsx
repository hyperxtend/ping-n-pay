import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import AppLayout from './components/layout/AppLayout'
import AuthLayout from './components/auth/AuthLayout'
import DashboardPage from './pages/DashboardPage'
import InvoicesPage from './pages/InvoicesPage'
import InvoiceDetailPage from './pages/InvoiceDetailPage'
import CreateInvoicePage from './pages/CreateInvoicePage'
import ClientsPage from './pages/ClientsPage'
import NotificationsPage from './pages/NotificationsPage'
import NotificationRulesPage from './pages/NotificationRulesPage'
import ReportsPage from './pages/ReportsPage'
import MfaVerifyPage from './pages/MfaVerifyPage'
import MfaSetupPage from './pages/MfaSetupPage'
import AccountPage from './pages/AccountPage'
import PublicInvoicePage from './pages/PublicInvoicePage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
            <Routes>
              {/* Public — login and register are tabs of one page (AuthLayout renders both forms) */}
              <Route path="/login" element={<AuthLayout />}>
                <Route index           element={null} />
                <Route path="register" element={null} />
              </Route>
              <Route path="/register"   element={<Navigate to="/login/register" replace />} />
              <Route path="/mfa-verify" element={<MfaVerifyPage />} />
              <Route path="/invoice/:token" element={<PublicInvoicePage />} />

              {/* Protected — inside sidebar layout */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard"        element={<DashboardPage />} />
                <Route path="/invoices"         element={<InvoicesPage />} />
                <Route path="/invoices/new"     element={<CreateInvoicePage />} />
                <Route path="/invoices/:id"     element={<InvoiceDetailPage />} />
                <Route path="/clients"             element={<ClientsPage />} />
                <Route path="/notifications"      element={<NotificationsPage />} />
                <Route path="/notification-rules" element={<NotificationRulesPage />} />
                <Route path="/reports"            element={<ReportsPage />} />
                <Route path="/account"           element={<AccountPage />} />
                <Route path="/account/mfa"       element={<MfaSetupPage />} />
              </Route>

              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
