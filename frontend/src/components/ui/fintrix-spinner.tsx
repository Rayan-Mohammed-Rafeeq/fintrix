import * as React from 'react'

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function FintrixSpinner({
  size = 40,
  className,
  alt = 'Loading',
}: {
  size?: number
  className?: string
  alt?: string
}) {
  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      aria-label={alt}
      role="status"
    >
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-2 border-white/15 border-t-white/70 animate-spin" />

      {/* App icon */}
      <img
        src="/icon.svg"
        alt="Fintrix"
        className="h-[70%] w-[70%] select-none rounded-[12px]"
        draggable={false}
        loading="eager"
      />
    </div>
  )
}

