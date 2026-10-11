import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  ListChecks,
  PlusCircle,
  Users,
  UserCheck,
  GitCompare,
  BookmarkCheck,
  Bell,
  Settings,
  LogOut,
  Briefcase,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import type { CompanyUser } from '@/types'

const navItems = [
  { to: '/company/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/company/profile', icon: Building2, label: 'Company Profile' },
  { to: '/company/internships', icon: ListChecks, label: 'Manage Internships' },
  { to: '/company/internships/create', icon: PlusCircle, label: 'Post Internship' },
  { to: '/company/applicants', icon: Users, label: 'Applicant Management' },
  { to: '/company/matching', icon: GitCompare, label: 'Candidate Matching' },
  { to: '/company/shortlist', icon: BookmarkCheck, label: 'Shortlist' },
]

const bottomItems = [
  { to: '/company/notifications', icon: Bell, label: 'Notifications' },
  { to: '/company/settings', icon: Settings, label: 'Settings' },
]

export function CompanySidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const company = user as CompanyUser | null

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col h-full overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-16 border-b border-slate-200 shrink-0">
        <div className="w-7 h-7 bg-secondary-600 rounded-lg flex items-center justify-center">
          <Briefcase className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-slate-900">CareerBridge AI</span>
      </div>

      {/* Company info */}
      <div className="px-4 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-secondary-100 flex items-center justify-center text-secondary-700 font-semibold text-sm shrink-0">
            {company?.companyName?.[0] ?? 'C'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {company?.companyName ?? 'Company'}
            </p>
            <div className="flex items-center gap-1">
              {company?.isVerified ? (
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" /> Verified
                </span>
              ) : (
                <span className="text-xs text-yellow-600">Pending verification</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/company/internships'}
            className={({ isActive }) => cn(isActive ? 'sidebar-link-active' : 'sidebar-link')}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-slate-100 space-y-1">
        {bottomItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => cn(isActive ? 'sidebar-link-active' : 'sidebar-link')}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors duration-150"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  )
}

export default CompanySidebar
