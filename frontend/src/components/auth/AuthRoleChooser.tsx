import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, TrendingUp, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Role } from '@/types'

const roleOptions = [
  {
    role: 'VIEWER' as const satisfies Role,
    icon: Wallet,
    eyebrow: 'Personal',
    title: 'Viewer',
    description: 'Track expenses and manage borrow/lend activity.',
    features: ['Expenses', 'Borrow/Lend', 'Private'],
    badge: 'Most common',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    iconColor: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    hoverBorder: 'hover:border-emerald-500/40',
    ctaColor: 'bg-emerald-500 hover:bg-emerald-400 text-black',
    registerLabel: 'Create account',
  },
  {
    role: 'ANALYST' as const satisfies Role,
    icon: TrendingUp,
    eyebrow: 'Insights',
    title: 'Analyst',
    description: 'Deeper reporting and analytics across your finances.',
    features: ['Reports', 'Analytics', 'Power tools'],
    badge: 'Power user',
    badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    iconColor: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
    hoverBorder: 'hover:border-indigo-500/40',
    ctaColor: 'bg-indigo-500 hover:bg-indigo-400 text-white',
    registerLabel: 'Create account',
  },
  {
    role: 'ADMIN' as const satisfies Role,
    icon: ShieldCheck,
    eyebrow: 'Admin',
    title: 'Administrator',
    description: 'Full workspace control — users, monitoring, oversight.',
    features: ['Users', 'Monitoring', 'Oversight'],
    badge: 'Workspace owner',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    iconColor: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    hoverBorder: 'hover:border-amber-500/40',
    ctaColor: 'bg-amber-500 hover:bg-amber-400 text-black',
    registerLabel: 'Create account',
  },
]

export function AuthRoleChooser() {
  return (
    <div className="w-full space-y-7">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="space-y-2 text-center">
        <span className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">
          Choose your workspace
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Pick an access level
        </h1>
        <p className="text-sm text-white/40">
          Sign in or create an account — you can switch later.
        </p>
      </div>

      {/* ── Role cards (horizontal rows) ───────────────────── */}
      <div className="flex flex-col gap-3">
        {roleOptions.map((option) => {
          const Icon = option.icon

          return (
            <div
              key={option.role}
              className={cn(
                'group relative flex flex-col gap-4 rounded-2xl border border-white/8 bg-white/3 p-5 transition-all duration-200',
                'hover:bg-white/5',
                option.hoverBorder,
              )}
            >
              {/* ── Top row: icon + label + badge ── */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border',
                      option.iconColor,
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Title + eyebrow */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
                      {option.eyebrow}
                    </p>
                    <p className="text-base font-bold text-white">{option.title}</p>
                  </div>
                </div>

                {/* Badge */}
                <span
                  className={cn(
                    'shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                    option.badgeColor,
                  )}
                >
                  {option.badge}
                </span>
              </div>

              {/* ── Description + feature pills ── */}
              <div className="space-y-2.5">
                <p className="text-sm leading-relaxed text-white/50">{option.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {option.features.map((f) => (
                    <span
                      key={f}
                      className="rounded-full border border-white/8 bg-white/4 px-2.5 py-0.5 text-[11px] font-medium text-white/50"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* ── Actions ── */}
              <div className="flex items-center gap-2.5 pt-0.5">
                <Link
                  to="/login"
                  className={cn(
                    'inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-150',
                    option.ctaColor,
                  )}
                >
                  Sign in
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex flex-1 items-center justify-center rounded-xl border border-white/10 bg-transparent px-4 py-2.5 text-sm font-medium text-white/60 transition-all duration-150 hover:border-white/20 hover:bg-white/5 hover:text-white"
                >
                  Create account
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
