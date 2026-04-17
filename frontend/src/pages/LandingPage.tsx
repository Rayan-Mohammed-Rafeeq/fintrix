import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  CreditCard,
  Lock,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { AppFooter } from '@/components/layout/AppFooter'
import { useState } from 'react'

export function LandingPage() {
  const [preview, setPreview] = useState<'dashboard' | 'expenses' | 'transactions' | 'workspaces'>('dashboard')

  const previewSrc =
    preview === 'dashboard'
      ? '/dashboard_dark.png'
      : preview === 'expenses'
        ? '/expenses.png'
        : preview === 'transactions'
          ? '/transactions.png'
          : '/workspaces.png'

  const features = [
    {
      icon: CreditCard,
      title: 'Expense Tracking',
      desc: 'Log, categorise, and review spending with clarity.',
    },
    {
      icon: TrendingUp,
      title: 'Insights & Reports',
      desc: 'Spot trends fast with a clean, modern dashboard.',
    },
    {
      icon: BarChart3,
      title: 'Borrow / Lend Ledger',
      desc: 'Track who owes what with full history.',
    },
    {
      icon: Lock,
      title: 'Private by default',
      desc: 'Your data stays inside your workspace.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white">
      {/* Ambient futuristic background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-24 right-[-120px] h-[420px] w-[420px] rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_55%)]" />
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:72px_72px] opacity-[0.12]" />
      </div>

      <div className="relative">
        {/* animated accent line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(16,185,129,0.65),rgba(34,211,238,0.55),transparent)] opacity-70 [background-size:200%_100%] animate-[fintrix-shimmer_7s_linear_infinite]" />
        <style>
          {`@keyframes fintrix-shimmer { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
            @keyframes fintrix-float { 0%,100%{ transform: translateY(0px) } 50%{ transform: translateY(-6px) } }
            @keyframes fintrix-fadeUp { 0%{ opacity:0; transform: translateY(10px)} 100%{ opacity:1; transform: translateY(0px)} }`}
        </style>
        <div className="mx-auto flex max-w-6xl flex-col px-6 pb-10 pt-10 sm:px-10 lg:pt-12">
          {/* Top nav */}
          <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="group flex items-center gap-3">
              <div className="relative">
                <div className="pointer-events-none absolute -inset-3 rounded-full bg-emerald-500/15 opacity-0 blur-xl transition-opacity duration-200 group-hover:opacity-100" />
                <img
                  src="/icon.svg"
                  alt="Fintrix"
                  className="h-10 w-10"
                  loading="eager"
                />
              </div>

              <div className="leading-tight">
                <div className="text-xl font-bold tracking-tight">Fintrix</div>
                <div className="text-xs text-white/40">Personal finance, reimagined</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/login"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition-all hover:border-[rgba(16,185,129,0.25)] hover:bg-[rgba(255,255,255,0.08)] hover:text-white hover:shadow-[0_0_18px_rgba(16,185,129,0.20)]"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-emerald-400 hover:shadow-[0_0_18px_rgba(16,185,129,0.35)]"
              >
                Get started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </header>

          {/* Hero */}
          <main className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:items-center [animation:fintrix-fadeUp_700ms_ease-out_both]">
            <div className="space-y-7 lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/70 shadow-[0_0_22px_rgba(16,185,129,0.10)]">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                New: workspace-first finance
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Your finance workspace,
                <span className="block bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-200 bg-clip-text text-transparent">
                  built for the future.
                </span>
              </h1>

              <p className="max-w-2xl text-base leading-relaxed text-white/60">
                Fintrix helps you track expenses, manage borrow/lend, and unlock insights — all inside a clean,
                modern dashboard.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-emerald-400 hover:shadow-[0_0_24px_rgba(16,185,129,0.38)]"
                >
                  Get started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/login"
                  className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80 transition-all hover:border-[rgba(16,185,129,0.25)] hover:bg-[rgba(255,255,255,0.08)] hover:text-white"
                >
                  I already have an account
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-7 text-center sm:max-w-xl">
                <div>
                  <div className="text-xl font-bold text-white">256-bit</div>
                  <div className="text-xs text-white/40">Encryption</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white">Multi</div>
                  <div className="text-xs text-white/40">Workspaces</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white">Fast</div>
                  <div className="text-xs text-white/40">Insights</div>
                </div>
              </div>
            </div>

            {/* Futuristic preview panel */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/40 [animation:fintrix-float_6s_ease-in-out_infinite]">
                <div className="pointer-events-none absolute -inset-20 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.22),transparent_55%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(16,185,129,0.10),transparent_45%)]" />

                <div className="relative space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-white/80">Product preview</div>
                      <div className="mt-0.5 text-xs text-white/40">Real screenshots from the app</div>
                    </div>
                    <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-emerald-300">
                      UI
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        { key: 'dashboard', label: 'Dashboard' },
                        { key: 'expenses', label: 'Expenses' },
                        { key: 'transactions', label: 'Transactions' },
                        { key: 'workspaces', label: 'Workspaces' },
                      ] as const
                    ).map(({ key, label }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setPreview(key)}
                        className={
                          preview === key
                            ? 'rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-200'
                            : 'rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/60 hover:bg-white/10 hover:text-white'
                        }
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                    <img
                      src={previewSrc}
                      alt={`${preview} screenshot`}
                      loading="lazy"
                      className="h-auto w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Feature grid */}
          <section className="mt-14 lg:mt-20">
            <div className="mb-6 flex items-end justify-between gap-6">
              <div>
                <h2 className="text-xl font-semibold">Designed for speed</h2>
                <p className="mt-1 text-sm text-white/50">Everything you need — without the clutter.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 transition-all hover:border-[rgba(16,185,129,0.25)] hover:bg-[rgba(255,255,255,0.06)]"
                >
                  <div className="pointer-events-none absolute -inset-24 opacity-0 transition-opacity group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.20),transparent_55%)]" />
                  <div className="relative">
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-emerald-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-sm font-semibold text-white/90">{title}</div>
                    <div className="mt-1 text-sm text-white/50">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom CTA (single action to avoid repetition) */}
          <section className="mt-14 lg:mt-20">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 sm:p-10">
              <div className="pointer-events-none absolute -inset-28 bg-[radial-gradient(circle_at_left,rgba(16,185,129,0.25),transparent_60%)]" />
              <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-xl font-semibold">Ready to build your finance workspace?</h3>
                  <p className="mt-1 text-sm text-white/50">Create an account in seconds and start tracking.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/register"
                    className="group inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-emerald-400 hover:shadow-[0_0_24px_rgba(16,185,129,0.38)]"
                  >
                    Create account
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Shared app footer (already styled) */}
        <AppFooter />
      </div>
    </div>
  )
}

