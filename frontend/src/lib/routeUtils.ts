import type { Role } from '@/types'

export function getDefaultRouteByRole(role?: Role): string {
  if (role === 'ADMIN') return '/admin'
  // VIEWER / ANALYST (and unknown/undefined) land on the member dashboard.
  return '/dashboard'
}

