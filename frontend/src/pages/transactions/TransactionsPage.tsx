import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import {
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle,
  ArrowLeftRight,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Empty } from '@/components/ui/empty'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Transaction } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import { useMarkAsPaidMutation, useTransactionsQuery } from '@/hooks'

type TransactionFilter = 'all' | 'BORROW' | 'LEND'
type StatusFilter = 'all' | 'PENDING' | 'PAID'

export function TransactionsPage() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<TransactionFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const { data: transactions = [], isLoading } = useTransactionsQuery(user?.id)
  const markAsPaidMutation = useMarkAsPaidMutation()

  const filteredTransactions = useMemo(() => {
    let result = [...transactions]

    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (t) =>
          t.personName.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower),
      )
    }

    if (typeFilter !== 'all') {
      result = result.filter((t) => t.type === typeFilter)
    }

    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter)
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [transactions, search, typeFilter, statusFilter])

  const stats = useMemo(() => {
    const borrowed = transactions.filter((t) => t.type === 'BORROW')
    const lent = transactions.filter((t) => t.type === 'LEND')
    return {
      totalBorrowed: borrowed.reduce((sum, t) => sum + t.amount, 0),
      totalLent: lent.reduce((sum, t) => sum + t.amount, 0),
      pendingBorrowed: borrowed.filter((t) => t.status === 'PENDING').reduce((sum, t) => sum + t.amount, 0),
      pendingLent: lent.filter((t) => t.status === 'PENDING').reduce((sum, t) => sum + t.amount, 0),
    }
  }, [transactions])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Manage your borrow and lend transactions
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link to="/transactions/borrow">
              <ArrowDownLeft className="mr-2 h-4 w-4" />
              Borrow
            </Link>
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/transactions/lend">
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Lend
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <ArrowDownLeft className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Borrowed</p>
                <p className="text-lg font-semibold">{formatCurrency(stats.totalBorrowed)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <ArrowUpRight className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Lent</p>
                <p className="text-lg font-semibold">{formatCurrency(stats.totalLent)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <ArrowDownLeft className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending to Pay</p>
                <p className="text-lg font-semibold">{formatCurrency(stats.pendingBorrowed)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ArrowUpRight className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending to Receive</p>
                <p className="text-lg font-semibold">{formatCurrency(stats.pendingLent)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TransactionFilter)}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="BORROW">Borrowed</SelectItem>
                <SelectItem value="LEND">Lent</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Transactions</CardTitle>
          <CardDescription>
            A list of all your borrow and lend transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Person</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction: Transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <Badge variant={transaction.type === 'LEND' ? 'default' : 'secondary'}>
                          {transaction.type === 'LEND' ? (
                            <ArrowUpRight className="mr-1 h-3 w-3" />
                          ) : (
                            <ArrowDownLeft className="mr-1 h-3 w-3" />
                          )}
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{transaction.personName}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{transaction.description}</TableCell>
                      <TableCell>{formatDate(transaction.transactionDate || transaction.createdAt)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={transaction.status === 'PAID' ? 'outline' : 'destructive'}
                          className={transaction.status === 'PAID' ? 'text-success border-success' : ''}
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        {transaction.status === 'PENDING' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              markAsPaidMutation.mutate(transaction.id, {
                                onSuccess: () => {
                                  toast.success('Transaction marked as paid')
                                },
                                onError: () => {
                                  toast.error('Failed to update transaction')
                                },
                              })
                            }}
                            disabled={markAsPaidMutation.isPending}
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Mark Paid
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Empty
              icon={ArrowLeftRight}
              title="No transactions found"
              description={search || typeFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by recording a borrow or lend transaction'}
            >
              {!search && typeFilter === 'all' && statusFilter === 'all' && (
                <div className="mt-4 flex gap-2">
                  <Button asChild variant="outline">
                    <Link to="/transactions/borrow">
                      <ArrowDownLeft className="mr-2 h-4 w-4" />
                      Borrow
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link to="/transactions/lend">
                      <ArrowUpRight className="mr-2 h-4 w-4" />
                      Lend
                    </Link>
                  </Button>
                </div>
              )}
            </Empty>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
