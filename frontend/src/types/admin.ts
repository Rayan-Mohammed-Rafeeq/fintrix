import type { Expense } from '@/types/expense'
import type { TransactionApiResponse } from '@/types/transaction'
import type { User } from '@/types/auth'

export interface AdminSummary {
  users: User[]
  expenses: Expense[]
  transactions: TransactionApiResponse[]
}

