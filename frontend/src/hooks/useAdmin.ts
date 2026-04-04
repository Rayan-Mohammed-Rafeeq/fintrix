import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/api'
import { queryKeys } from '@/hooks/queryKeys'

export function useAdminUsersQuery() {
  return useQuery({
    queryKey: queryKeys.adminUsers,
    queryFn: adminApi.getUsers,
  })
}

export function useAdminExpensesQuery() {
  return useQuery({
    queryKey: queryKeys.adminExpenses,
    queryFn: adminApi.getExpenses,
  })
}

export function useAdminTransactionsQuery() {
  return useQuery({
    queryKey: queryKeys.adminTransactions,
    queryFn: adminApi.getTransactions,
  })
}
