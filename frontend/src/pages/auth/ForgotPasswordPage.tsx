import { useMemo, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, Loader2, Mail, KeyRound, Eye, EyeOff } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FintrixSpinner } from '@/components/ui/fintrix-spinner'
import {
  useRequestPasswordResetOtpMutation,
  useResetPasswordWithOtpMutation,
} from '@/hooks'

const requestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type RequestFormData = z.infer<typeof requestSchema>

const resetSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    otp: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type ResetFormData = z.infer<typeof resetSchema>

type Step = 'request' | 'reset'

export function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('request')
  const [email, setEmail] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const requestMutation = useRequestPasswordResetOtpMutation()
  const resetMutation = useResetPasswordWithOtpMutation()

  const {
    register: registerRequest,
    handleSubmit: handleSubmitRequest,
    formState: { errors: requestErrors },
  } = useForm<RequestFormData>({ resolver: zodResolver(requestSchema) })

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: resetErrors },
    setValue: setResetValue,
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: '',
    },
  })

  // Keep email synced into the OTP form so it stays visible/populated.
  useEffect(() => {
    setResetValue('email', email)
  }, [email, setResetValue])

  const isBusy = useMemo(
    () => requestMutation.isPending || resetMutation.isPending,
    [requestMutation.isPending, resetMutation.isPending],
  )

  const onSubmitRequest = (data: RequestFormData) => {
    setEmail(data.email)
    requestMutation.mutate(
      { email: data.email },
      {
        onSuccess: () => {
          toast.success('If that email exists, we sent a 6-digit OTP to it.')
          setStep('reset')
        },
        onError: () => {
          toast.error('Failed to send OTP')
        },
      },
    )
  }

  const onSubmitReset = (data: ResetFormData) => {
    setEmail(data.email)
    resetMutation.mutate(
      { email: data.email, otp: data.otp, newPassword: data.newPassword },
      {
        onSuccess: () => {
          toast.success('Password updated. Please sign in.')
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message ?? 'Failed to reset password')
        },
      },
    )
  }

  return (
    <div className="relative mx-auto w-full max-w-md space-y-8">
      {isBusy && (
        <div className="absolute inset-0 z-50 grid place-items-center rounded-2xl bg-black/50 p-6 backdrop-blur">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/70 p-6 text-center shadow-2xl ring-1 ring-white/10">
            <FintrixSpinner
              size={56}
              className="mx-auto"
              alt={step === 'request' ? 'Sending OTP' : 'Updating password'}
            />
            <div className="mt-4 space-y-2">
              <p className="text-base font-semibold text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.65)]">
                {step === 'request' ? 'Sending OTP…' : 'Updating password…'}
              </p>
              <p className="text-sm leading-relaxed text-white/80 [text-shadow:0_1px_12px_rgba(0,0,0,0.75)]">
                If this is your first visit, it may take a few seconds. Since the backend is hosted on
                Render (free tier), it can sometimes take up to ~3 minutes to wake up after inactivity.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <div className="text-sm font-semibold text-white/70">Reset your password</div>
        <Link
          to="/login"
          className="inline-flex items-center gap-1 text-sm font-medium text-white/50 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/70">
          {step === 'request' ? <Mail className="h-6 w-6" /> : <KeyRound className="h-6 w-6" />}
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Forgot password</h1>
        <p className="text-sm text-white/50">
          {step === 'request'
            ? 'Enter your email and we’ll send a 6-digit OTP to reset your password.'
            : 'Enter the OTP sent to your email and choose a new password.'}
        </p>

        <p className="text-xs leading-relaxed text-white/40">
          If this is your first visit, it may take a few seconds. Since the backend is hosted on Render
          (free tier), it can sometimes take up to ~3 minutes to wake up after inactivity.
        </p>
      </div>

      {step === 'request' ? (
        <form onSubmit={handleSubmitRequest(onSubmitRequest)} className="space-y-5" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-white/70">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="h-11 border-white/10 bg-white/5 text-white placeholder:text-white/25"
              {...registerRequest('email')}
            />
            {requestErrors.email && <p className="text-xs text-red-400">{requestErrors.email.message}</p>}
          </div>

          <Button
            type="submit"
            className="h-11 w-full rounded-xl bg-emerald-500 text-black hover:bg-emerald-400"
            disabled={isBusy}
          >
            {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send OTP'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmitReset(onSubmitReset)} className="space-y-5" noValidate>
          <div className="space-y-2">
            <Label htmlFor="resetEmail" className="text-sm font-medium text-white/70">
              Email
            </Label>
            <Input
              id="resetEmail"
              type="email"
              placeholder="you@example.com"
              className="h-11 border-white/10 bg-white/5 text-white placeholder:text-white/25"
              {...registerReset('email')}
            />
            {resetErrors.email && <p className="text-xs text-red-400">{resetErrors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="otp" className="text-sm font-medium text-white/70">
              OTP code
            </Label>
            <Input
              id="otp"
              inputMode="numeric"
              placeholder="123456"
              className="h-11 border-white/10 bg-white/5 text-white placeholder:text-white/25"
              {...registerReset('otp')}
            />
            {resetErrors.otp && <p className="text-xs text-red-400">{resetErrors.otp.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium text-white/70">
              New password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="h-11 border-white/10 bg-white/5 pr-11 text-white placeholder:text-white/25"
                {...registerReset('newPassword')}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {resetErrors.newPassword && (
              <p className="text-xs text-red-400">{resetErrors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-white/70">
              Confirm password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="h-11 border-white/10 bg-white/5 pr-11 text-white placeholder:text-white/25"
                {...registerReset('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {resetErrors.confirmPassword && (
              <p className="text-xs text-red-400">{resetErrors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="h-11 w-full rounded-xl bg-emerald-500 text-black hover:bg-emerald-400"
            disabled={isBusy}
          >
            {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reset password'}
          </Button>

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              className="px-0 text-xs text-white/50 hover:text-white"
              disabled={isBusy || !email}
              onClick={() =>
                requestMutation.mutate(
                  { email },
                  {
                    onSuccess: () => toast.success('If that email exists, we sent a new OTP.'),
                    onError: () => toast.error('Failed to resend OTP'),
                  },
                )
              }
            >
              Resend OTP
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="px-0 text-xs text-white/50 hover:text-white"
              disabled={isBusy}
              onClick={() => setStep('request')}
            >
              Change email
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

