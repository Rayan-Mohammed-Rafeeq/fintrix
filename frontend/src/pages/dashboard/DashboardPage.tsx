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
import {
  CATEGORICAL_COLORS,
  AXIS_STYLE,
  GRID_STYLE,
  LINE_CHART_STYLES,
  CHART_PALETTE,
} from '@/lib/chart-theme'

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#F59E0B',
  Transportation: '#3B82F6',
  Entertainment: '#10B981',
  Shopping: '#8B5CF6',
  Bills: '#EF4444',
  Healthcare: '#06B6D4',
  Education: '#6366F1',
  Travel: '#EC4899',
  Other: '#6B7280',
}

const FALLBACK_SLICE_COLOR = '#6B7280'


function ChartTooltip({ active, payload, label, formatter }: any) {
  if (!active || !payload?.length) return null

  return (
    <div className="chart-tooltip">
      {label ? <div className="mb-1 text-xs text-muted-foreground">{label}</div> : null}
      <div className="space-y-1">
        {payload.map((p: any, i: number) => {
          const color = p.color || p.fill || p.stroke || CATEGORICAL_COLORS[i % CATEGORICAL_COLORS.length]
          const name = p.name ?? p.dataKey
          const value = formatter ? formatter(p.value, name, p, i) : p.value
          return (
            <div key={`${name}-${i}`} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: color }}
                />
                <span className="text-xs text-foreground/80">{name}</span>
              </div>
              <span className="text-xs font-medium text-foreground">{value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function GradientBar(props: any) {
  const { x, y, width, height, index } = props
  const fill = CATEGORICAL_COLORS[index % CATEGORICAL_COLORS.length]
  const id = `barGradient-${index}`

  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity={1} />
          <stop offset="100%" stopColor={fill} stopOpacity={0.75} />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={width} height={height} rx={4} ry={4} fill={`url(#${id})`} />
    </g>
  )
}

function ChartDefs() {
  return (
    <defs>
      {/* Emerald neon line/area gradient */}
      <linearGradient id="areaEmerald" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={CHART_PALETTE.emerald} stopOpacity={0.4} />
        <stop offset="75%" stopColor={CHART_PALETTE.emerald} stopOpacity={0.14} />
        <stop offset="100%" stopColor={CHART_PALETTE.emerald} stopOpacity={0.04} />
      </linearGradient>

      {/* Subtle glow for the line stroke */}
      <filter id="lineGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  )
}

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

  const pieData = useMemo(
    () =>
      expensesByCategory.map((d) => ({
        ...d,
        fill: CATEGORY_COLORS[d.name] || FALLBACK_SLICE_COLOR,
      })),
    [expensesByCategory],
  )

  // Stable chart data: filter out 0 values and keep a consistent reference
  // so the donut doesn't render partial segments while data is still settling.
  const stablePieData = useMemo(
    () => pieData.filter((d) => Number(d.value) > 0),
    [pieData],
  )

  // Debug: confirm per-slice colors are present (prevents Recharts defaulting to black)
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log(
      '[DashboardPage] expensesByCategory slice colors:',
      expensesByCategory.map((d, i) => ({ name: d.name, value: d.value, fill: CATEGORICAL_COLORS[i % CATEGORICAL_COLORS.length] })),
    )
  }

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
            ) : stablePieData.length > 0 ? (
              <div className="chart-isolated">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={stablePieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      isAnimationActive={false}
                      stroke="transparent"
                    >
                      {stablePieData.map((entry) => (
                        <Cell
                          key={`cell-${entry.name}`}
                          style={{ fill: CATEGORY_COLORS[entry.name] || FALLBACK_SLICE_COLOR }}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                {/* Custom legend (single source of truth: stablePieData + CATEGORY_COLORS) */}
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                  {stablePieData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-sm"
                        style={{ backgroundColor: CATEGORY_COLORS[item.name] || FALLBACK_SLICE_COLOR }}
                      />
                      <span className="text-xs text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
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
                  <ChartDefs />
                  <CartesianGrid {...GRID_STYLE} />
                  <XAxis dataKey="month" {...AXIS_STYLE} />
                  <YAxis {...AXIS_STYLE} tickFormatter={(v) => formatCurrency(Number(v))} />
                  <Tooltip content={<ChartTooltip formatter={(v: number) => formatCurrency(v)} />} />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    fill="url(#areaEmerald)"
                    {...LINE_CHART_STYLES}
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
                  <ChartDefs />
                  <CartesianGrid {...GRID_STYLE} />
                  <XAxis dataKey="name" {...AXIS_STYLE} />
                  <YAxis {...AXIS_STYLE} tickFormatter={(v) => formatCurrency(Number(v))} />
                  <Tooltip content={<ChartTooltip formatter={(v: number) => formatCurrency(v)} />} />
                  <Bar dataKey="amount" shape={<GradientBar />} isAnimationActive={false}>
                    {borrowVsLend.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CATEGORICAL_COLORS[index % CATEGORICAL_COLORS.length]}
                      />
                    ))}
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
