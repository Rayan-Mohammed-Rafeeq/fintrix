import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { transactionsApi } from '@/api'
import { queryKeys } from '@/hooks/queryKeys'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import type { Transaction, TransactionApiResponse } from '@/types'

function mapTransaction(item: TransactionApiResponse, currentUserId?: number): Transaction {
  const isBorrow = item.borrowerId === currentUserId
  return {
    id: item.id,
    amount: item.amount,
    type: isBorrow ? 'BORROW' : 'LEND',
    personName: isBorrow ? item.lenderName : item.borrowerName,
    description: item.description,
    status: item.status,
    transactionDate: item.transactionDate,
    createdAt: item.createdAt,
    borrowerId: item.borrowerId,
    lenderId: item.lenderId,
  }
}

export function useTransactionsQuery(currentUserId?: number) {
  const { activeWorkspaceId } = useWorkspace()
  return useQuery({
    queryKey: [...queryKeys.transactions, activeWorkspaceId, currentUserId] as const,
    enabled: typeof activeWorkspaceId === 'number' && activeWorkspaceId > 0,
    queryFn: async () => {
      const data = await transactionsApi.getAll(activeWorkspaceId as number)
      return data.map((item) => mapTransaction(item, currentUserId))
    },
  })
}

export function useBorrowMutation() {
  const queryClient = useQueryClient()
  const { activeWorkspaceId } = useWorkspace()
  return useMutation({
    mutationFn: (payload: Parameters<typeof transactionsApi.borrow>[1]) => {
      if (!activeWorkspaceId) throw new Error('No workspace selected')
      return transactionsApi.borrow(activeWorkspaceId, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions })
    },
  })
}

export function useLendMutation() {
  const queryClient = useQueryClient()
  const { activeWorkspaceId } = useWorkspace()
  return useMutation({
    mutationFn: (payload: Parameters<typeof transactionsApi.lend>[1]) => {
      if (!activeWorkspaceId) throw new Error('No workspace selected')
      return transactionsApi.lend(activeWorkspaceId, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions })
    },
  })
}

export function useMarkAsPaidMutation() {
  const queryClient = useQueryClient()
  const { activeWorkspaceId } = useWorkspace()
  return useMutation({
    mutationFn: (id: number) => {
      if (!activeWorkspaceId) throw new Error('No workspace selected')
      return transactionsApi.markAsPaid(activeWorkspaceId, id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions })
      queryClient.invalidateQueries({ queryKey: queryKeys.adminTransactions })
    },
  })
}
