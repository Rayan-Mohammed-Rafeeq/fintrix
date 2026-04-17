import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { getDefaultRouteByRole } from '@/lib/routeUtils'
import { LandingPage } from '@/pages/LandingPage'

// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'

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
  const { isAuthenticated, isReady } = useAuth()

  if (!isReady) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={getDefaultRouteByRole()} replace />
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Legacy route removed: redirect to OTP flow */}
        <Route path="/reset-password" element={<Navigate to="/forgot-password" replace />} />
      </Route>

      {/* Protected App Routes */}
      <Route
        path="/app"
        element={
          <ProtectedRoute allowedRoles={['VIEWER', 'ANALYST', 'ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Default app entry */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* User */}
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="expenses/new" element={<NewExpensePage />} />
        <Route path="expenses/:id/edit" element={<EditExpensePage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="transactions/borrow" element={<BorrowPage />} />
        <Route path="transactions/lend" element={<LendPage />} />

        {/* Workspaces */}
        <Route path="workspaces" element={<WorkspacesPage />} />
        <Route path="workspaces/members" element={<WorkspaceMembersPage />} />

        {/* Admin */}
        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/expenses"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminExpensesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/transactions"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminTransactionsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Backwards-compatible redirects for old URLs */}
      <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/expenses" element={<Navigate to="/app/expenses" replace />} />
      <Route path="/expenses/new" element={<Navigate to="/app/expenses/new" replace />} />
      <Route path="/expenses/:id/edit" element={<Navigate to="/app/expenses/:id/edit" replace />} />
      <Route path="/transactions" element={<Navigate to="/app/transactions" replace />} />
      <Route path="/transactions/borrow" element={<Navigate to="/app/transactions/borrow" replace />} />
      <Route path="/transactions/lend" element={<Navigate to="/app/transactions/lend" replace />} />
      <Route path="/workspaces" element={<Navigate to="/app/workspaces" replace />} />
      <Route path="/workspaces/members" element={<Navigate to="/app/workspaces/members" replace />} />
      <Route path="/admin" element={<Navigate to="/app/admin" replace />} />
      <Route path="/admin/users" element={<Navigate to="/app/admin/users" replace />} />
      <Route path="/admin/expenses" element={<Navigate to="/app/admin/expenses" replace />} />
      <Route path="/admin/transactions" element={<Navigate to="/app/admin/transactions" replace />} />

      {/* Unknown routes: if authed, go to app; otherwise go to landing */}
      <Route path="*" element={<RoleRedirect />} />
    </Routes>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
