export * from '@/types/api'
export * from '@/types/auth'
export * from '@/types/expense'
export * from '@/types/transaction'
export * from '@/types/admin'

export interface DashboardStats {
  totalExpenses: number
  totalBorrowed: number
  totalLent: number
  pendingBorrowed: number
  pendingLent: number
}
