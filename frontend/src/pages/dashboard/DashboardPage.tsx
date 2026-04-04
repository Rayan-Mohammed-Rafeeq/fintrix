import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Receipt,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Plus,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { formatCurrency } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { useExpensesQuery, useTransactionsQuery } from '@/hooks'
import type { Expense, Transaction } from '@/types'

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

export function DashboardPage() {
  const { user } = useAuth()

  const { data: expenses = [], isLoading: expensesLoading } = useExpensesQuery()
  const { data: transactions = [], isLoading: transactionsLoading } = useTransactionsQuery(user?.id)

  const stats = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
    const borrowed = transactions.filter((t) => t.type === 'BORROW')
    const lent = transactions.filter((t) => t.type === 'LEND')
    const totalBorrowed = borrowed.reduce((sum, t) => sum + t.amount, 0)
    const totalLent = lent.reduce((sum, t) => sum + t.amount, 0)
    const pendingBorrowed = borrowed
      .filter((t) => t.status === 'PENDING')
      .reduce((sum, t) => sum + t.amount, 0)
    const pendingLent = lent
      .filter((t) => t.status === 'PENDING')
      .reduce((sum, t) => sum + t.amount, 0)

    return { totalExpenses, totalBorrowed, totalLent, pendingBorrowed, pendingLent }
  }, [expenses, transactions])

  const expensesByCategory = useMemo(() => {
    const categoryMap: Record<string, number> = {}
    expenses.forEach((e) => {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount
    })
    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }))
  }, [expenses])

  const expenseTrend = useMemo(() => {
    const monthlyData: Record<string, number> = {}
    expenses.forEach((e) => {
      const month = new Date(e.date).toLocaleDateString('en-US', { month: 'short' })
      monthlyData[month] = (monthlyData[month] || 0) + e.amount
    })
    return Object.entries(monthlyData)
      .slice(-6)
      .map(([month, amount]) => ({ month, amount }))
  }, [expenses])

  const borrowVsLend = useMemo(() => {
    const borrowed = transactions.filter((t) => t.type === 'BORROW').reduce((sum, t) => sum + t.amount, 0)
    const lent = transactions.filter((t) => t.type === 'LEND').reduce((sum, t) => sum + t.amount, 0)
    return [
      { name: 'Borrowed', amount: borrowed },
      { name: 'Lent', amount: lent },
    ]
  }, [transactions])

  const recentExpenses = expenses.slice(0, 5)
  const recentTransactions = transactions.slice(0, 5)

  const isLoading = expensesLoading || transactionsLoading

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="default">Member Dashboard</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s your personal finance overview for expenses, borrowing, and lending.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/expenses/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Link>
          </Button>
        </div>
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
            <StatsCard
              title="Total Expenses"
              value={stats.totalExpenses}
              icon={Receipt}
              variant="default"
            />
            <StatsCard
              title="Total Borrowed"
              value={stats.totalBorrowed}
              icon={ArrowDownLeft}
              variant="warning"
            />
            <StatsCard
              title="Total Lent"
              value={stats.totalLent}
              icon={ArrowUpRight}
              variant="success"
            />
            <StatsCard
              title="Pending Balance"
              value={stats.pendingLent - stats.pendingBorrowed}
              icon={TrendingUp}
              variant={stats.pendingLent >= stats.pendingBorrowed ? 'success' : 'destructive'}
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Expenses by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Expenses by Category</CardTitle>
            <CardDescription>Distribution of your spending</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : expensesByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {expensesByCategory.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                No expense data yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expense Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Expense Trend</CardTitle>
            <CardDescription>Monthly spending pattern</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : expenseTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={expenseTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                No trend data yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Borrow vs Lend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Borrow vs Lend</CardTitle>
            <CardDescription>Transaction comparison</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : borrowVsLend.some((d) => d.amount > 0) ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={borrowVsLend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                    <Cell fill="hsl(var(--chart-3))" />
                    <Cell fill="hsl(var(--chart-1))" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                No transaction data yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Tables */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Expenses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Expenses</CardTitle>
              <CardDescription>Your latest expenses</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/expenses">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentExpenses.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentExpenses.map((expense: Expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.title}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{expense.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex h-24 items-center justify-center text-muted-foreground">
                No expenses yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Transactions</CardTitle>
              <CardDescription>Your latest borrow/lend transactions</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/transactions">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentTransactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Person</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction: Transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.personName}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.type === 'LEND' ? 'default' : 'secondary'}>
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={transaction.status === 'PAID' ? 'outline' : 'destructive'}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(transaction.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex h-24 items-center justify-center text-muted-foreground">
                No transactions yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
