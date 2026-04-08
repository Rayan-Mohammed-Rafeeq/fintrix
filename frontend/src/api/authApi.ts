import { apiClient } from '@/api/client'
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types'

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
}

// OTP-based flow
export interface RequestPasswordResetOtpRequest {
  email: string
}

export interface VerifyPasswordResetOtpRequest {
  email: string
  otp: string
}

export interface ResetPasswordWithOtpRequest {
  email: string
  otp: string
  newPassword: string
}

export const authApi = {
  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/register', payload)
    return response.data
  },

  async login(payload: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/login', payload)
    return response.data
  },

  // legacy token-link flow
  async forgotPassword(payload: ForgotPasswordRequest): Promise<void> {
    await apiClient.post('/api/v1/auth/forgot-password', payload)
  },

  async resetPassword(payload: ResetPasswordRequest): Promise<void> {
    await apiClient.post('/api/v1/auth/reset-password', payload)
  },

  // OTP flow
  async requestPasswordResetOtp(payload: RequestPasswordResetOtpRequest): Promise<void> {
    await apiClient.post('/api/v1/auth/forgot-password/request-otp', payload)
  },

  async verifyPasswordResetOtp(payload: VerifyPasswordResetOtpRequest): Promise<void> {
    await apiClient.post('/api/v1/auth/forgot-password/verify-otp', payload)
  },

  async resetPasswordWithOtp(payload: ResetPasswordWithOtpRequest): Promise<void> {
    await apiClient.post('/api/v1/auth/forgot-password/reset-password', payload)
  },
}
