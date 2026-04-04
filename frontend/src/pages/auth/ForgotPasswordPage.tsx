import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, Loader2, Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForgotPasswordMutation } from '@/hooks'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type FormData = z.infer<typeof schema>

export function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const mutation = useForgotPasswordMutation()

  const onSubmit = (data: FormData) => {
    mutation.mutate(
      { email: data.email },
      {
        onSuccess: () => {
          // Backend doesn't reveal if email exists.
          toast.success('If that email exists, a reset link/token has been generated.')
          toast.message('For local dev: check backend console logs for the reset token.')
        },
        onError: () => {
          toast.error('Failed to request password reset')
        },
      },
    )
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-8">
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
          <Mail className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Forgot password</h1>
        <p className="text-sm text-white/50">
          Enter your email. We’ll generate a reset token (demo: printed in backend logs).
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-white/70">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="h-11 border-white/10 bg-white/5 text-white placeholder:text-white/25"
            {...register('email')}
          />
          {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
        </div>

        <Button
          type="submit"
          className="h-11 w-full rounded-xl bg-emerald-500 text-black hover:bg-emerald-400"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generate reset token'}
        </Button>

        <p className="text-center text-xs text-white/30">
          Already have a token?{' '}
          <Link to="/reset-password" className="text-emerald-400 hover:underline">
            Reset password
          </Link>
        </p>
      </form>
    </div>
  )
}

