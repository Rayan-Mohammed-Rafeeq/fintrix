import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Receipt,
  ArrowLeftRight,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'
import { useAdminExpensesQuery, useAdminTransactionsQuery, useAdminUsersQuery } from '@/hooks'
import { Badge } from '@/components/ui/badge'

export function AdminDashboardPage() {
  const { data: users = [], isLoading: usersLoading } = useAdminUsersQuery()
  const { data: expenses = [], isLoading: expensesLoading } = useAdminExpensesQuery()
  const { data: transactions = [], isLoading: transactionsLoading } = useAdminTransactionsQuery()

  const stats = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
    const totalTransactions = transactions.reduce((sum, t) => sum + t.amount, 0)
    const pendingTransactions = transactions.filter((t) => t.status === 'PENDING').length

    return {
      totalUsers: users.length,
      totalExpenses,
      totalExpenseCount: expenses.length,
      totalTransactions,
      totalTransactionCount: transactions.length,
      pendingTransactions,
    }
  }, [users, expenses, transactions])

  const isLoading = usersLoading || expensesLoading || transactionsLoading

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="secondary">
            <ShieldCheck className="h-3 w-3" />
            Administrator Control Center
          </Badge>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Review workspace-wide users, expenses, and transaction activity from one place.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                    <p className="text-3xl font-bold">{stats.totalUsers}</p>
                    <p className="text-xs text-muted-foreground">Registered accounts</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                    <p className="text-3xl font-bold">{formatCurrency(stats.totalExpenses)}</p>
                    <p className="text-xs text-muted-foreground">{stats.totalExpenseCount} expenses</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-1/10">
                    <Receipt className="h-6 w-6 text-chart-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                    <p className="text-3xl font-bold">{formatCurrency(stats.totalTransactions)}</p>
                    <p className="text-xs text-muted-foreground">{stats.totalTransactionCount} transactions</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                    <ArrowLeftRight className="h-6 w-6 text-chart-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-3xl font-bold">{stats.pendingTransactions}</p>
                    <p className="text-xs text-muted-foreground">Pending transactions</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                    <TrendingUp className="h-6 w-6 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Users</CardTitle>
              <CardDescription>Manage all registered users</CardDescription>
            </div>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost" className="w-full justify-between">
              <Link to="/admin/users">
                View all users
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Expenses</CardTitle>
              <CardDescription>View all user expenses</CardDescription>
            </div>
            <Receipt className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost" className="w-full justify-between">
              <Link to="/admin/expenses">
                View all expenses
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Transactions</CardTitle>
              <CardDescription>View all user transactions</CardDescription>
            </div>
            <ArrowLeftRight className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost" className="w-full justify-between">
              <Link to="/admin/transactions">
                View all transactions
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
