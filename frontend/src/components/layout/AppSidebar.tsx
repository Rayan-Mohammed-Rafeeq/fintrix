import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Receipt,
  ArrowLeftRight,
  Users,
  LogOut,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { getInitials } from '@/lib/utils'
import { getRoleLabel } from '@/lib/roleUtils'
import { LogoutConfirm } from '@/components/auth/LogoutConfirm'

const userNavItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Expenses',
    href: '/expenses',
    icon: Receipt,
  },
  {
    title: 'Transactions',
    href: '/transactions',
    icon: ArrowLeftRight,
  },
]

const workspaceNavItems = [
  {
    title: 'My Workspaces',
    href: '/workspaces',
    icon: Wallet,
  },
  {
    title: 'Members',
    href: '/workspaces/members',
    icon: Users,
  },
]

interface AppSidebarProps {
  onClose?: () => void
}

export function AppSidebar({ onClose }: AppSidebarProps) {
  const location = useLocation()
  const { user, isAdmin } = useAuth()
  const isUser = user?.role === 'VIEWER' || user?.role === 'ANALYST'
  const isWorkspaceUser = !!user

  const handleNavClick = () => {
    onClose?.()
  }

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Make the entire sidebar scrollable so the logout button is always reachable (mobile/zoom). */}
      <ScrollArea
        className="h-full"
        viewportClassName="scrollbar-none"
        scrollbarClassName="hidden"
      >
        <div className="flex min-h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 px-6">
            <img src="/icon.png" alt="Fintrix" className="h-9 w-9" loading="eager" />
            <span className="text-xl font-bold tracking-tight">Fintrix</span>
          </div>

          <Separator className="bg-sidebar-border" />

          {/* Navigation */}
          <div className="px-3 py-4">
            <div className="space-y-6">
              {(isUser || isAdmin) && (
                <div className="space-y-1">
                  <p className="px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                    Main Menu
                  </p>
                  <nav className="space-y-1">
                    {userNavItems.map((item) => {
                      const isActive = location.pathname === item.href ||
                        (item.href !== '/dashboard' && location.pathname.startsWith(item.href))
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={handleNavClick}
                          className={cn(
                            'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ease-[cubic-bezier(.2,.8,.2,1)]',
                            isActive
                              ? 'border border-[rgba(16,185,129,0.35)] bg-[rgba(16,185,129,0.12)] text-white shadow-[0_0_18px_rgba(16,185,129,0.45)]'
                              : 'border border-transparent text-sidebar-foreground/70 hover:scale-[1.02] hover:border-[rgba(16,185,129,0.25)] hover:bg-[linear-gradient(90deg,rgba(16,185,129,0.12),rgba(16,185,129,0.06))] hover:text-white hover:shadow-[0_0_14px_rgba(16,185,129,0.40)]',
                          )}
                        >
                          <item.icon className={cn(
                            'h-5 w-5 transition-colors duration-200',
                            isActive ? 'text-[#10B981]' : 'text-sidebar-foreground/70 group-hover:text-[#10B981]',
                          )} />
                          {item.title}
                        </Link>
                      )
                    })}
                  </nav>
                </div>
              )}

              {/* Workspace Area (visible for all authenticated users) */}
              {isWorkspaceUser && (
                <div className="space-y-1">
                  <p className="px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                    Workspace
                  </p>
                  <nav className="space-y-1">
                    {workspaceNavItems.map((item) => {
                      const isActive = location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={handleNavClick}
                          className={cn(
                            'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ease-[cubic-bezier(.2,.8,.2,1)]',
                            isActive
                              ? 'border border-[rgba(16,185,129,0.35)] bg-[rgba(16,185,129,0.12)] text-white shadow-[0_0_18px_rgba(16,185,129,0.45)]'
                              : 'border border-transparent text-sidebar-foreground/70 hover:scale-[1.02] hover:border-[rgba(16,185,129,0.25)] hover:bg-[linear-gradient(90deg,rgba(16,185,129,0.12),rgba(16,185,129,0.06))] hover:text-white hover:shadow-[0_0_14px_rgba(16,185,129,0.40)]',
                          )}
                        >
                          <item.icon className={cn(
                            'h-5 w-5 transition-colors duration-200',
                            isActive ? 'text-[#10B981]' : 'text-sidebar-foreground/70 group-hover:text-[#10B981]',
                          )} />
                          {item.title}
                        </Link>
                      )
                    })}
                  </nav>
                </div>
              )}

              {/* (Administration section removed from sidebar) */}

              {/* Quick Stats */}
              <div className="space-y-2">
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                  Quick Stats
                </p>
                <div className="rounded-lg bg-sidebar-accent/30 p-4">
                  <div className="flex items-center gap-2 text-sm text-sidebar-foreground/70">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span>Track your finances</span>
                  </div>
                  <p className="mt-1 text-xs text-sidebar-foreground/50">
                    Stay on top of expenses and transactions
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <Separator className="bg-sidebar-border" />

            {/* User Profile */}
            <div className="p-4">
              <div className="flex items-center gap-3 overflow-visible">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium">{user?.name || 'User'}</p>
                  <p className="truncate text-xs text-sidebar-foreground/50">{user?.email}</p>
                  <p className="mt-1 truncate text-[11px] font-medium uppercase tracking-wide text-primary/90">
                    {getRoleLabel(user?.role)}
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <LogoutConfirm
                  onLoggedOut={onClose}
                  trigger={
                    <Button
                      variant="ghost"
                      className={cn(
                        // Layout
                        'group relative w-full justify-start gap-2.5 rounded-xl px-4 py-2.5',
                        // Typography
                        'text-[13px] font-medium tracking-wide',
                        // Base (dark + subtle transparency)
                        'bg-black/20 text-red-200/90 backdrop-blur-sm',
                        // Border (thin, soft danger)
                        'border border-red-500/25',
                        // Interaction
                        'transition-all duration-200 ease-out',
                        'hover:-translate-y-px hover:bg-black/30 hover:text-red-100',
                        'focus-visible:ring-2 focus-visible:ring-red-500/25 focus-visible:ring-offset-0',
                        // Glow (soft red + slight green blend)
                        'hover:shadow-[0_0_0_1px_rgba(239,68,68,0.25),0_0_18px_rgba(239,68,68,0.22),0_0_16px_rgba(16,185,129,0.12)]',
                      )}
                    >
                      <LogOut className="h-4 w-4 text-red-200/80 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                      <span className="leading-none">Logout</span>
                    </Button>
                  }
                  title="Log out?"
                  description="Are you sure you want to log out?"
                  confirmText="Log out"
                />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
