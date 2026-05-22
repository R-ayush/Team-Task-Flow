import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import { Avatar, AvatarFallback } from '../ui/Avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog'
import { Button } from '../ui/Button'
import { Menu, Sun, Moon, User, Mail, LogOut } from 'lucide-react'

export default function Header({ onMobileMenuToggle, pageTitle }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

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
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 border-b border-white/[0.06] bg-slate-950/60 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileMenuToggle}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        {pageTitle && (
          <h2 className="text-lg font-semibold text-white hidden sm:block">
            {pageTitle}
          </h2>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-white/[0.06] bg-slate-900/40 text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all hover:scale-105 active:scale-95"
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Profile Button Trigger */}
        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="flex items-center gap-3 p-1.5 rounded-xl border border-transparent hover:border-white/[0.06] hover:bg-slate-900/40 transition-all duration-200 active:scale-95 group text-left"
          title="View profile details"
        >
          <div className="hidden sm:block text-right animate-fade-in">
            <p className="text-sm font-medium text-white group-hover:text-primary-300 transition-colors">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-slate-500">{user?.email || ''}</p>
          </div>
          <Avatar className="w-9 h-9 ring-2 ring-transparent group-hover:ring-primary-500/30 transition-all">
            <AvatarFallback className="text-xs">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
        </button>
      </div>

      {/* Profile Details Modal */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="max-w-[360px] w-[92vw] p-6 gap-5 border-white/[0.06] bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl">
          <DialogHeader className="pb-3 border-b border-white/[0.06]">
            <DialogTitle className="text-base font-semibold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-primary-400" /> User Profile
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center text-center py-2">
            <Avatar className="w-16 h-16 ring-4 ring-primary-500/10 mb-3 shadow-md">
              <AvatarFallback className="text-xl font-bold">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-base font-semibold text-white leading-snug">{user?.name}</h3>
            <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-1 justify-center">
              <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" /> {user?.email}
            </p>
          </div>

          <div className="bg-slate-950/40 rounded-xl p-4 border border-white/[0.04] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">System Role</span>
              <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/10">
                User
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Account Status</span>
              <span className="text-indigo-400 font-semibold bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/10">
                Active
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              variant="outline"
              className="flex-1 border-white/[0.08] hover:bg-slate-800/40 text-xs h-9 transition-all"
              onClick={() => setIsProfileModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1 gap-2 text-xs h-9 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 transition-all font-medium"
              onClick={() => {
                setIsProfileModalOpen(false)
                logout()
              }}
            >
              <LogOut className="w-3.5 h-3.5" /> Log Out
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}
