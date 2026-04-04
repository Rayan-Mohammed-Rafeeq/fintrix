import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { expensesApi } from '@/api'
import { queryKeys } from '@/hooks/queryKeys'
import { useWorkspace } from '@/contexts/WorkspaceContext'

export function useExpensesQuery() {
  const { activeWorkspaceId } = useWorkspace()
  return useQuery({
    queryKey: [...queryKeys.expenses, activeWorkspaceId] as const,
    enabled: typeof activeWorkspaceId === 'number' && activeWorkspaceId > 0,
    queryFn: () => expensesApi.getAll(activeWorkspaceId as number),
  })
}

export function useCreateExpenseMutation() {
  const queryClient = useQueryClient()
  const { activeWorkspaceId } = useWorkspace()
  return useMutation({
    mutationFn: (payload: Parameters<typeof expensesApi.create>[1]) => {
      if (!activeWorkspaceId) throw new Error('No workspace selected')
      return expensesApi.create(activeWorkspaceId, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses })
    },
  })
}

export function useUpdateExpenseMutation() {
  const queryClient = useQueryClient()
  const { activeWorkspaceId } = useWorkspace()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Parameters<typeof expensesApi.update>[2] }) => {
      if (!activeWorkspaceId) throw new Error('No workspace selected')
      return expensesApi.update(activeWorkspaceId, id, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses })
    },
  })
}

export function useDeleteExpenseMutation() {
  const queryClient = useQueryClient()
  const { activeWorkspaceId } = useWorkspace()
  return useMutation({
    mutationFn: (id: number) => {
      if (!activeWorkspaceId) throw new Error('No workspace selected')
      return expensesApi.remove(activeWorkspaceId, id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses })
    },
  })
}

