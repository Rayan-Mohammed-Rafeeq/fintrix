import { apiClient } from '@/api/client'
import type { Expense, ExpenseRequest } from '@/types'

export const expensesApi = {
  async getAll(workspaceId: number): Promise<Expense[]> {
    const response = await apiClient.get<Expense[]>(`/api/v1/workspaces/${workspaceId}/expenses`)
    return response.data
  },

  async create(workspaceId: number, payload: ExpenseRequest): Promise<Expense> {
    const response = await apiClient.post<Expense>(`/api/v1/workspaces/${workspaceId}/expenses`, payload)
    return response.data
  },

  async update(workspaceId: number, id: number, payload: ExpenseRequest): Promise<Expense> {
    const response = await apiClient.put<Expense>(`/api/v1/workspaces/${workspaceId}/expenses/${id}`, payload)
    return response.data
  },

  async remove(workspaceId: number, id: number): Promise<void> {
    await apiClient.delete(`/api/v1/workspaces/${workspaceId}/expenses/${id}`)
  },
}

