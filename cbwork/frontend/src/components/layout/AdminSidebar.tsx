import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Building2,
  ListChecks,
  FileStack,
  BarChart3,
  ShieldCheck,
  Settings,
  LogOut,
  Briefcase,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import type { AdminUser } from '@/types'

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'User Management' },
  { to: '/admin/verifications', icon: ShieldCheck, label: 'Company Verifications' },
  { to: '/admin/internships', icon: ListChecks, label: 'Internship Moderation' },
  { to: '/admin/applications', icon: FileStack, label: 'Application Overview' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
]

export function AdminSidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const admin = user as AdminUser | null

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <aside className="w-64 shrink-0 bg-slate-900 flex flex-col h-full overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-16 border-b border-slate-700 shrink-0">
        <div className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center">
          <Briefcase className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="font-bold text-white text-sm">CareerBridge AI</p>
          <p className="text-xs text-slate-400">Admin Panel</p>
        </div>
      </div>

      {/* Admin info */}
      <div className="px-4 py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-semibold text-sm shrink-0">
            {admin?.name?.[0] ?? 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {admin?.name ?? 'Administrator'}
            </p>
            <p className="text-xs text-slate-400 truncate">{admin?.email ?? ''}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              )
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 w-full transition-colors duration-150"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar
