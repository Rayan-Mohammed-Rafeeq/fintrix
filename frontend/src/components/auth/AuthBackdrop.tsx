import { cn } from '@/lib/utils'

interface AuthBackdropProps {
  className?: string
}

/**
 * Premium animated background for auth screens.
 * Multi-layer: base gradient + animated orbs + grid overlay + vignette.
 * Pure CSS – respects prefers-reduced-motion.
 */
export function AuthBackdrop({ className }: AuthBackdropProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        className,
      )}
    >
      {/* ── Layer 1: deep navy base ───────────────────────── */}
      <div className="absolute inset-0 bg-[#070b14]" />

      {/* ── Layer 2: large ambient colour orbs ───────────── */}
      {/* top-left emerald orb */}
      <div className="auth-orb-1 absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full bg-emerald-500/8 blur-3xl" />
      {/* top-right indigo orb */}
      <div className="auth-orb-2 absolute -right-24 -top-24 h-[500px] w-[500px] rounded-full bg-indigo-500/8 blur-3xl" />
      {/* bottom-center teal orb */}
      <div className="auth-orb-3 absolute -bottom-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-teal-500/6 blur-3xl" />
      {/* mid-right accent */}
      <div className="auth-orb-4 absolute right-1/4 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-violet-500/6 blur-2xl" />

      {/* ── Layer 3: grid overlay ────────────────────────── */}
      <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:80px_80px]" />

      {/* ── Layer 4: dot accent (top-left quadrant) ──────── */}
      <div
        className="absolute left-0 top-0 h-1/2 w-1/2 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.25) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 60% 60% at 20% 20%, black, transparent)',
          WebkitMaskImage:
            'radial-gradient(ellipse 60% 60% at 20% 20%, black, transparent)',
        }}
      />

      {/* ── Layer 5: edge vignette ───────────────────────── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  )
}
