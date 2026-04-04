import { apiClient } from '@/api/client'
import type { TransactionApiResponse, TransactionRequest } from '@/types'

export const transactionsApi = {
  async getAll(workspaceId: number): Promise<TransactionApiResponse[]> {
    const response = await apiClient.get<TransactionApiResponse[]>(
      `/api/v1/workspaces/${workspaceId}/transactions`,
    )
    return response.data
  },

  async borrow(workspaceId: number, payload: TransactionRequest): Promise<TransactionApiResponse> {
    const response = await apiClient.post<TransactionApiResponse>(
      `/api/v1/workspaces/${workspaceId}/transactions/borrow`,
      payload,
    )
    return response.data
  },

  async lend(workspaceId: number, payload: TransactionRequest): Promise<TransactionApiResponse> {
    const response = await apiClient.post<TransactionApiResponse>(
      `/api/v1/workspaces/${workspaceId}/transactions/lend`,
      payload,
    )
    return response.data
  },

  async markAsPaid(workspaceId: number, id: number): Promise<TransactionApiResponse> {
    const response = await apiClient.put<TransactionApiResponse>(
      `/api/v1/workspaces/${workspaceId}/transactions/${id}/pay`,
    )
    return response.data
  },
}

