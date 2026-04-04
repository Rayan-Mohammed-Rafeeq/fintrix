import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, KeyRound, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useResetPasswordMutation } from '@/hooks'

const schema = z.object({
  token: z.string().min(10, 'Token is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof schema>

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tokenFromQuery = searchParams.get('token') ?? ''
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      token: tokenFromQuery,
    },
  })

  const mutation = useResetPasswordMutation()

  const onSubmit = (data: FormData) => {
    mutation.mutate(
      { token: data.token, newPassword: data.newPassword },
      {
        onSuccess: () => {
          toast.success('Password updated. Please sign in.')
          navigate('/login', { replace: true })
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message ?? 'Failed to reset password')
        },
      },
    )
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm font-semibold text-white/70">Set a new password</div>
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
          <KeyRound className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Reset password</h1>
        <p className="text-sm text-white/50">
          If you opened this page from the email link, your token is filled in automatically.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="token" className="text-sm font-medium text-white/70">
            Reset token
          </Label>
          <Input
            id="token"
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            className="h-11 border-white/10 bg-white/5 text-white placeholder:text-white/25"
            {...register('token')}
          />
          {errors.token && <p className="text-xs text-red-400">{errors.token.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword" className="text-sm font-medium text-white/70">
            New password
          </Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="New password"
            className="h-11 border-white/10 bg-white/5 text-white placeholder:text-white/25"
            {...register('newPassword')}
          />
          {errors.newPassword && (
            <p className="text-xs text-red-400">{errors.newPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="h-11 w-full rounded-xl bg-emerald-500 text-black hover:bg-emerald-400"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update password'}
        </Button>
      </form>
    </div>
  )
}

