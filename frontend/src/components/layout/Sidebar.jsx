import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../lib/utils'
import { Avatar, AvatarFallback } from '../ui/Avatar'
import { Separator } from '../ui/Separator'
import {
  LayoutDashboard,
  FolderKanban,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import Logo from '../ui/Logo'

const navItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Projects',
    path: '/projects',
    icon: FolderKanban,
  },
]

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getInitials = (name) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen flex flex-col border-r border-white/[0.06] bg-slate-950/80 backdrop-blur-2xl transition-all duration-300',
        isCollapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center px-4 h-16 border-b border-white/[0.06] overflow-hidden">
        <Logo className="w-9 h-9" textClassName="text-base" iconOnly={isCollapsed} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-primary-500/15 text-primary-300 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                )
              }
            >
              <Icon
                className={cn(
                  'w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110'
                )}
              />
              {!isCollapsed && (
                <span className="animate-fade-in">{item.label}</span>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 pb-2">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-center w-full p-2 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800/60 transition-all duration-200"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      <Separator />

      {/* User section */}
      <div className="p-3">
        <div
          className={cn(
            'flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/40 transition-colors',
            isCollapsed && 'justify-center'
          )}
        >
          <Avatar className="w-9 h-9 shrink-0">
            <AvatarFallback className="text-xs">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 animate-fade-in">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user?.email || ''}
              </p>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
        {isCollapsed && (
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full p-2 mt-1 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  )
}
