import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/api'

export function useLoginMutation() {
  return useMutation({
    mutationFn: authApi.login,
  })
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: authApi.register,
  })
}

// legacy token-link flow
export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: authApi.forgotPassword,
  })
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: authApi.resetPassword,
  })
}

// OTP flow
export function useRequestPasswordResetOtpMutation() {
  return useMutation({
    mutationFn: authApi.requestPasswordResetOtp,
  })
}

export function useVerifyPasswordResetOtpMutation() {
  return useMutation({
    mutationFn: authApi.verifyPasswordResetOtp,
  })
}

export function useResetPasswordWithOtpMutation() {
  return useMutation({
    mutationFn: authApi.resetPasswordWithOtp,
  })
}
