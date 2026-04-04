export interface Expense {
  id: number
  userId: number
  title: string
  amount: number
  category: string
  date: string
  createdAt: string
}

export interface ExpenseRequest {
  title: string
  amount: number
  category: string
  date: string
}

export type ExpenseCategory =
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Healthcare'
  | 'Education'
  | 'Travel'
  | 'Other'

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Education',
  'Travel',
  'Other',
]

