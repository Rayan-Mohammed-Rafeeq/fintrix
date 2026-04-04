import { Link } from 'react-router-dom'
import { Menu, Bell, Search, ShieldCheck, Wallet } from 'lucide-react'
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
import { getInitials } from '@/lib/utils'
import { getRoleLabel } from '@/lib/roleUtils'

interface NavbarProps {
  onMenuClick: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const HomeIcon = isAdmin ? ShieldCheck : Wallet
  const homeHref = isAdmin ? '/admin' : '/dashboard'
  const workspaceLabel = isAdmin ? 'Admin Workspace' : 'Member Workspace'

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-card px-4 md:px-6">
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

      <div className="flex min-w-0 flex-1 items-center gap-3 md:flex-none">
        <Button
          asChild
          variant="ghost"
          className="hidden h-auto items-center gap-2 px-2 py-1.5 md:inline-flex"
        >
          <Link to={homeHref}>
            <HomeIcon className="h-4 w-4" />
            <span className="font-medium">{workspaceLabel}</span>
          </Link>
        </Button>
        <Badge
          variant={isAdmin ? 'secondary' : 'default'}
          className="hidden sm:inline-flex"
        >
          {getRoleLabel(user?.role)} mode
        </Badge>
      </div>

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
            className="w-full bg-secondary pl-10"
          />
        </div>
      </div>

      {/* Mobile Search */}
      <div className="flex-1 md:hidden" />

      {/* Right Side */}
      <div className="flex items-center gap-2">
        {/* Search Button (Mobile) */}
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

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.name ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
