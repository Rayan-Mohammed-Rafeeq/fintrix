import { useState, useMemo } from 'react'
import {
  Search,
  ArrowLeftRight,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import type { TransactionApiResponse } from '@/types'
import { useAdminTransactionsQuery } from '@/hooks'

type StatusFilter = 'all' | 'PENDING' | 'PAID'

export function AdminTransactionsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const { data: transactions = [], isLoading } = useAdminTransactionsQuery()

  const filteredTransactions = useMemo(() => {
    let result = [...transactions]

    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (t) =>
          t.borrowerName.toLowerCase().includes(searchLower) ||
          t.lenderName.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower),
      )
    }

    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter)
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [transactions, search, statusFilter])

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">All Transactions</h1>
        <p className="text-muted-foreground">
          View all borrow/lend transactions across the platform
        </p>
      </div>

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

      <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
        <span className="text-sm text-muted-foreground">
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </span>
        <span className="font-semibold">
          Total: {formatCurrency(totalAmount)}
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Transactions</CardTitle>
          <CardDescription>A list of all user transactions</CardDescription>
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
                    <TableHead>Borrower</TableHead>
                    <TableHead>Lender</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction: TransactionApiResponse) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="font-medium">{transaction.borrowerName}</div>
                        <div className="text-xs text-muted-foreground">#{transaction.borrowerId}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{transaction.lenderName}</div>
                        <div className="text-xs text-muted-foreground">#{transaction.lenderId}</div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{transaction.description}</TableCell>
                      <TableCell>{formatDate(transaction.createdAt)}</TableCell>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Empty
              icon={ArrowLeftRight}
              title="No transactions found"
              description={search || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'No transactions have been recorded yet'}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
