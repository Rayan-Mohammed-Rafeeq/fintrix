import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { getDefaultRouteByRole } from '@/lib/routeUtils'

// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage'

// User Pages
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { ExpensesPage } from '@/pages/expenses/ExpensesPage'
import { NewExpensePage } from '@/pages/expenses/NewExpensePage'
import { EditExpensePage } from '@/pages/expenses/EditExpensePage'
import { TransactionsPage } from '@/pages/transactions/TransactionsPage'
import { BorrowPage } from '@/pages/transactions/BorrowPage'
import { LendPage } from '@/pages/transactions/LendPage'

// Admin Pages
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage'
import { AdminExpensesPage } from '@/pages/admin/AdminExpensesPage'
import { AdminTransactionsPage } from '@/pages/admin/AdminTransactionsPage'
import { WorkspaceMembersPage } from '@/pages/workspaces/WorkspaceMembersPage'
  import { WorkspacesPage } from '@/pages/workspaces/WorkspacesPage'

function RoleRedirect() {
  const { user, isAuthenticated, isReady } = useAuth()

  if (!isReady) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={getDefaultRouteByRole(user?.role)} replace />
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Protected User Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['VIEWER', 'ANALYST', 'ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/expenses/new" element={<NewExpensePage />} />
        <Route path="/expenses/:id/edit" element={<EditExpensePage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/transactions/borrow" element={<BorrowPage />} />
        <Route path="/transactions/lend" element={<LendPage />} />
      </Route>

      {/* Protected Workspace Routes (multi-tenant area) */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['VIEWER', 'ANALYST', 'ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/workspaces" element={<WorkspacesPage />} />
        <Route path="/workspaces/members" element={<WorkspaceMembersPage />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/expenses" element={<AdminExpensesPage />} />
        <Route path="/admin/transactions" element={<AdminTransactionsPage />} />
      </Route>

      <Route path="/" element={<RoleRedirect />} />
      <Route path="*" element={<RoleRedirect />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
