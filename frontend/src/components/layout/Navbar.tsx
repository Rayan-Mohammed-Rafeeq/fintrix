import { Link } from 'react-router-dom'
import { Menu, Bell, Search, Moon, Sun } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { getInitials } from '@/lib/utils'
import { getRoleLabel } from '@/lib/roleUtils'
import { cn } from '@/lib/utils'
import { LogoutConfirm } from '@/components/auth/LogoutConfirm'

interface NavbarProps {
  onMenuClick: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user } = useAuth()
  const { toggleTheme, isDark } = useTheme()
  const isAdmin = user?.role === 'ADMIN'

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border/60 bg-card/80 px-4 backdrop-blur-md md:px-6">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Search */}
      <div className="hidden flex-1 md:flex">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={
              isAdmin
                ? 'Search users, expenses, transactions...'
                : 'Search expenses, transactions...'
            }
            className="w-full bg-secondary/60 pl-10 focus-visible:ring-primary/50"
          />
        </div>
      </div>

      {/* Mobile spacer */}
      <div className="flex-1 md:hidden" />

      {/* Right Side */}
      <div className="flex items-center gap-1.5">
        {/* Mobile Search */}
        <Button variant="ghost" size="icon" className="md:hidden">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>

        {/* ── Theme Toggle ─────────────────────────────────────── */}
        <Button
          id="theme-toggle"
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className={cn(
            'relative overflow-hidden transition-all duration-200',
            'hover:bg-primary/10 hover:text-primary',
          )}
        >
          {/* Sun icon — visible in dark mode */}
          <Sun
            className={cn(
              'absolute h-5 w-5 transition-all duration-300',
              isDark
                ? 'rotate-0 scale-100 opacity-100'
                : 'rotate-90 scale-0 opacity-0',
            )}
          />
          {/* Moon icon — visible in light mode */}
          <Moon
            className={cn(
              'absolute h-5 w-5 transition-all duration-300',
              isDark
                ? '-rotate-90 scale-0 opacity-0'
                : 'rotate-0 scale-100 opacity-100',
            )}
          />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="relative h-9 w-9 rounded-full ring-2 ring-primary/0 transition-all hover:ring-primary/40"
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  {user?.name ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </div>
    </header>
  )
}
