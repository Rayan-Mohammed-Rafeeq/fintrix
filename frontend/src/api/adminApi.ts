import { apiClient } from '@/api/client'
import type { Expense, TransactionApiResponse, User } from '@/types'

export const adminApi = {
  async getUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/api/v1/admin/users')
    return response.data
  },

  async getExpenses(): Promise<Expense[]> {
    const response = await apiClient.get<Expense[]>('/api/v1/admin/expenses')
    return response.data
  },

  async getTransactions(): Promise<TransactionApiResponse[]> {
    const response = await apiClient.get<TransactionApiResponse[]>('/api/v1/admin/transactions')
    return response.data
  },
}

