import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FintrixSpinner } from '@/components/ui/fintrix-spinner'
import { useAuth } from '@/contexts/AuthContext'
import { useLoginMutation } from '@/hooks'
import { buildAuthRoute } from '@/lib/authRoleFlow'
import { getDefaultRouteByRole } from '@/lib/routeUtils'
import { getRoleLabel } from '@/lib/roleUtils'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const mutation = useLoginMutation()

  // Users should NOT select a role during login.
  // We determine the role after auth succeeds (from backend response / JWT).
  const isAdmin = false
  const roleLabel = 'Sign in'

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data, {
      onSuccess: (authResponse) => {
        login(authResponse)
        toast.success(`Welcome back, ${getRoleLabel(authResponse.role)}!`)
        navigate(getDefaultRouteByRole(), { replace: true })
      },
      onError: () => {
        toast.error('Invalid email or password')
      },
    })
  }

  /* ── role-specific palette ─────────────────────────────────── */
  const roleAccent = isAdmin
    ? {
        pill: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
        icon: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
        glow: 'shadow-amber-500/20',
        ring: 'focus-visible:ring-amber-500/50',
        btn: 'bg-amber-500 hover:bg-amber-400 text-black',
      }
    : {
        pill: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
        icon: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        glow: 'shadow-emerald-500/20',
        ring: 'focus-visible:ring-emerald-500/50',
        btn: 'bg-emerald-500 hover:bg-emerald-400 text-black',
      }

  return (
    <div className="relative mx-auto w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
      {mutation.isPending && (
        <div className="absolute inset-0 z-50 grid place-items-center rounded-2xl bg-black/50 p-6 backdrop-blur">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/70 p-6 text-center shadow-2xl ring-1 ring-white/10">
            <FintrixSpinner size={56} className="mx-auto" alt="Signing you in" />
            <div className="mt-4 space-y-2">
              <p className="text-base font-semibold text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.65)]">
                Signing you in…
              </p>
              <p className="text-sm leading-relaxed text-white/80 [text-shadow:0_1px_12px_rgba(0,0,0,0.75)]">
                If this is your first visit, it may take a few seconds. Since the backend
                is hosted on Render (free tier), it can sometimes take up to ~3 minutes to
                wake up after inactivity.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Header row ─────────────────────────────────────────── */}
      <div className="mb-8 flex items-center justify-between gap-4">
        {/* Role pill */}
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest ${roleAccent.pill}`}
        >
          <img src="/icon.svg" alt="Fintrix" className="h-3 w-3" loading="eager" />
          {roleLabel} access
        </span>

        <Link
          to="/register"
          className="inline-flex items-center gap-1 text-sm font-medium text-white/50 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Create account
        </Link>
      </div>

      {/* ── Icon + headline ─────────────────────────────────────── */}
      <div className="mb-8 space-y-4 text-center">
        {/* Floating icon */}
        <img src="/icon.svg" alt="Fintrix" className="mx-auto h-16 w-16" loading="eager" />

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome back
          </h1>
          <p className="mx-auto max-w-xs text-sm leading-relaxed text-white/50">
            Sign in to your personal finance workspace.
          </p>
        </div>
      </div>

      {/* ── Form card ───────────────────────────────────────────── */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-white/70">
            Email address
          </Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className={`h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/25 backdrop-blur ${roleAccent.ring} focus-visible:border-white/20 transition-colors`}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="flex items-center gap-1 text-xs text-red-400">
              <span className="inline-block h-1 w-1 rounded-full bg-red-400" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-white/70">
              Password
            </Label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-white/40 transition-colors hover:text-white/70"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              autoComplete="current-password"
              className={`h-11 border-white/10 bg-white/5 pl-10 pr-12 text-white placeholder:text-white/25 backdrop-blur ${roleAccent.ring} focus-visible:border-white/20 transition-colors`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/30 transition-colors hover:text-white/70"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="flex items-center gap-1 text-xs text-red-400">
              <span className="inline-block h-1 w-1 rounded-full bg-red-400" />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={mutation.isPending}
          className={`relative mt-2 h-12 w-full overflow-hidden rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 ${
            isAdmin
              ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30'
              : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30'
          }`}
        >
          {mutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <span className="inline-flex items-center gap-2">
               Sign in
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      </form>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <div className="mt-8 space-y-4">
        <p className="text-center text-sm text-white/40">
          Don&apos;t have an account?{' '}
          <Link
            to={buildAuthRoute('/register', 'VIEWER')}
            className="inline-flex items-center gap-2 rounded-lg px-2 py-1 font-medium text-emerald-400 transition-all duration-[250ms] ease-in-out hover:scale-[1.02] hover:bg-[rgba(16,185,129,0.08)] hover:text-white hover:shadow-[0_0_10px_rgba(16,185,129,0.4)] hover:ring-1 hover:ring-[rgba(16,185,129,0.25)]"
          >
            Create account
          </Link>
        </p>

        {/* Trust line */}
        <p className="text-center text-xs text-white/20 transition-all duration-[250ms] ease-in-out hover:text-white/60">
          Protected by 256-bit encryption · Your data is private
        </p>
      </div>
    </div>
  )
}
