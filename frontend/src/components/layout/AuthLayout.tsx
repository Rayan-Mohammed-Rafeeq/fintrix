import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import {
  BarChart3,
  CreditCard,
  Lock,
  ShieldCheck,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { getDefaultRouteByRole } from '@/lib/routeUtils'
import { AuthBackdrop } from '@/components/auth/AuthBackdrop'
import { AppFooter } from '@/components/layout/AppFooter'

const features = [
  {
    icon: CreditCard,
    title: 'Expense Tracking',
    desc: 'Log and categorise every spend instantly.',
  },
  {
    icon: BarChart3,
    title: 'Borrow / Lend Ledger',
    desc: 'Track money owed with full history.',
  },
  {
    icon: TrendingUp,
    title: 'Insights & Reports',
    desc: 'Visual trends across your finances.',
  },
  {
    icon: Lock,
    title: 'Private by default',
    desc: 'Your data never leaves your workspace.',
  },
]

const stats = [
  { value: '256-bit', label: 'AES encryption' },
  { value: '99.9%', label: 'uptime SLA' },
  { value: '< 100ms', label: 'API latency' },
]

export function AuthLayout() {
  const { isAuthenticated, isReady } = useAuth()
  const location = useLocation()

  const showFooter = location.pathname === '/login' || location.pathname === '/register'

  if (!isReady) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to={getDefaultRouteByRole()} replace />
  }

  return (
    <div className="relative min-h-screen bg-[#0a0f1c] text-white">
      <AuthBackdrop />

      {/* Full-screen centered container */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="flex flex-1 items-center justify-center pt-12 sm:pt-14 lg:pt-16">
        <div className="w-full max-w-7xl px-6 sm:px-10 lg:px-16">
          {/* Balanced split layout */}
          <div className="grid w-full items-center gap-12 lg:grid-cols-2">

            {/* ── LEFT: Branding panel ──────────────────────────── */}
            <div className="hidden flex-col justify-center gap-10 lg:flex">

              {/* Logo */}
              <div className="flex items-center gap-3">
                <img src="/icon.png" alt="Fintrix" className="h-11 w-11" loading="eager" />
                <div>
                  <span className="text-2xl font-bold tracking-tight">Fintrix</span>
                </div>
              </div>

              {/* Headline */}
              <div className="space-y-3">
                <h2 className="text-4xl font-bold leading-tight tracking-tight">
                  Your finances,{' '}
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                    finally organised
                  </span>
                </h2>
                <p className="max-w-sm text-base leading-relaxed text-white/50">
                  A modern finance workspace for tracking expenses, managing
                  debts, and staying in control every day.
                </p>
              </div>

              {/* Feature list */}
              <div className="grid grid-cols-1 gap-4">
                {features.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3 group">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-colors group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10">
                      <Icon className="h-4 w-4 text-white/40 transition-colors group-hover:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white/80">{title}</p>
                      <p className="text-xs text-white/40">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 border-t border-white/8 pt-6">
                {stats.map(({ value, label }) => (
                  <div key={label} className="space-y-0.5">
                    <p className="text-lg font-bold text-white">{value}</p>
                    <p className="text-xs text-white/40">{label}</p>
                  </div>
                ))}
              </div>

              {/* Trust badge */}
              <div className="flex items-center gap-2 text-xs text-white/30">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500/60" />
                <span>Bank-grade security · Zero-knowledge architecture</span>
              </div>
            </div>

            {/* ── RIGHT: Form panel ─────────────────────────────── */}
            <div className="flex w-full items-center justify-center py-10 lg:py-0">
              {/* Ambient glow behind the card */}
              <div className="pointer-events-none absolute h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />

              <div className="relative w-full max-w-xl rounded-3xl border border-white/8 bg-white/4 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10">
                {/* Top-right accent dot */}
                <span className="absolute right-8 top-8 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>

                <Outlet />

                {/* Bottom power-by line */}
                <div className="mt-8 flex items-center justify-center gap-1.5 text-[10px] text-white/20">
                  <Zap className="h-3 w-3" />
                  <span>Powered by Fintrix · Built for speed</span>
                </div>
              </div>
            </div>

          </div>
        </div>
        </div>

        {/* Page footer (ONLY on login page) */}
        {showFooter && (
          <div className="mt-20 sm:mt-24 lg:mt-28">
            {/* subtle separation from main content */}
            <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* soft fade into footer to avoid harsh edge */}
            <div className="pointer-events-none h-10 bg-gradient-to-b from-transparent via-[#0a0f1c]/60 to-[#0a0f1c]" />

            <AppFooter />
          </div>
        )}
      </div>
    </div>
  )
}
