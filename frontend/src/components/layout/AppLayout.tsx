import { Suspense } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { NotificationBell } from '../NotificationBell'

const navItems = [
  { to: '/dashboard',            label: 'Dashboard'           },
  { to: '/invoices',             label: 'Invoices'            },
  { to: '/clients',              label: 'Clients'             },
  { to: '/notifications',        label: 'Notifications'       },
  { to: '/notification-rules',   label: 'Notification Rules'  },
  { to: '/reports',              label: 'Reports'             },
  { to: '/account',              label: 'Account'             },
]

export default function AppLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-100">
          <span className="font-semibold text-gray-900 text-base">Ping 'n Pay</span>
          <p className="text-xs text-gray-400 mt-0.5">{user?.organisationName}</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 truncate">
            {user?.firstName} {user?.lastName}
          </p>
          <button
            onClick={logout}
            className="mt-1 text-xs text-gray-400 hover:text-gray-600"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-end px-6 flex-shrink-0">
          <NotificationBell />
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
