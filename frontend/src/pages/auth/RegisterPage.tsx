import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FintrixSpinner } from '@/components/ui/fintrix-spinner'
import { useAuth } from '@/contexts/AuthContext'
import { useRegisterMutation } from '@/hooks'
import { getDefaultRouteByRole } from '@/lib/routeUtils'
import { getRoleLabel } from '@/lib/roleUtils'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  // Roles are assigned by the backend. New users become ADMIN of their own workspace.
  const isAdmin = false

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const mutation = useRegisterMutation()

  const onSubmit = (data: RegisterFormData) => {
    mutation.mutate(
      {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: (authResponse) => {
          login(authResponse)
          toast.success(`${getRoleLabel(authResponse.role)} account created successfully!`)
          navigate(getDefaultRouteByRole(), { replace: true })
        },
        onError: () => {
          toast.error('Failed to create account. Please try again.')
        },
      },
    )
  }

  return (
    <div className="relative mx-auto w-full max-w-md space-y-8">
      {mutation.isPending && (
        <div className="absolute inset-0 z-50 grid place-items-center rounded-2xl bg-black/50 p-6 backdrop-blur">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/70 p-6 text-center shadow-2xl ring-1 ring-white/10">
            <FintrixSpinner size={56} className="mx-auto" alt="Creating your account" />
            <div className="mt-4 space-y-2">
              <p className="text-base font-semibold text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.65)]">
                Creating your account…
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

      <div className="flex items-center justify-between gap-4">
        <Badge variant={isAdmin ? 'secondary' : 'default'} className="px-3 py-1">
          Workspace onboarding
        </Badge>
        <Link
          to="/login"
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
      </div>

      <div className="space-y-3 text-center">
        <img src="/icon.png" alt="Fintrix" className="mx-auto h-14 w-14" loading="eager" />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {isAdmin ? 'Create your Administrator account' : 'Create your Member account'}
          </h1>
          <p className="text-muted-foreground">
            {isAdmin
              ? 'Set up your admin credentials to access the Fintrix oversight workspace and standard finance tools.'
              : 'Set up your Fintrix workspace to track expenses, record transactions, and stay on top of your finances.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder={isAdmin ? 'Workspace Owner' : 'John Doe'}
              autoComplete="name"
              className="h-11 bg-background/40 backdrop-blur focus-visible:ring-primary/60"
              {...registerField('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder={isAdmin ? 'owner@fintrix.com' : 'name@example.com'}
              autoComplete="email"
              className="h-11 bg-background/40 backdrop-blur focus-visible:ring-primary/60"
              {...registerField('email')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={isAdmin ? 'Create your admin password' : 'Create a password'}
                autoComplete="new-password"
                className="h-11 bg-background/40 pr-12 backdrop-blur focus-visible:ring-primary/60"
                {...registerField('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              autoComplete="new-password"
              className="h-11 bg-background/40 backdrop-blur focus-visible:ring-primary/60"
              {...registerField('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-11"
          disabled={mutation.isPending}
        >
          {mutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isAdmin ? 'Create admin account' : 'Create account'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
