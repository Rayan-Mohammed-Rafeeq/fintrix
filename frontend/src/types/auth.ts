// Backend roles: com.fintrix.backend.enums.Role
export type Role = 'ADMIN' | 'ANALYST' | 'VIEWER'

export interface User {
  id: number
  email: string
  name: string
  role: Role
  createdAt?: string
}

export interface AuthResponse {
  token: string
  tokenType: 'Bearer' | string
  userId: number
  name: string
  email: string
  role: Role
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}
