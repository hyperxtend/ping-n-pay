import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import InvoicesPage from './pages/InvoicesPage'
import InvoiceDetailPage from './pages/InvoiceDetailPage'
import CreateInvoicePage from './pages/CreateInvoicePage'
import ClientsPage from './pages/ClientsPage'

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
            {/* Public */}
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

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
              <Route path="/clients"          element={<ClientsPage />} />
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
