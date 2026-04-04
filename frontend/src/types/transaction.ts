export type TransactionStatus = 'PENDING' | 'PAID'
export type TransactionType = 'BORROW' | 'LEND'

export interface TransactionApiResponse {
  id: number
  amount: number
  borrowerId: number
  borrowerName: string
  lenderId: number
  lenderName: string
  description: string
  status: TransactionStatus
  createdAt: string
}

export interface Transaction {
  id: number
  amount: number
  type: TransactionType
  personName: string
  description: string
  status: TransactionStatus
  createdAt: string
  borrowerId: number
  lenderId: number
}

export interface TransactionRequest {
  counterpartyUserId: number
  amount: number
  description: string
}

