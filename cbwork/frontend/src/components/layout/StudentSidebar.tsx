import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  User,
  FileText,
  BarChart2,
  Search,
  Map,
  Star,
  Compass,
  SendHorizonal,
  Bell,
  Settings,
  LogOut,
  Briefcase,
  BookOpen,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import type { StudentUser } from '@/types'

const navItems = [
  { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/student/profile', icon: User, label: 'My Profile' },
  { to: '/student/resumes', icon: FileText, label: 'Resumes' },
  { to: '/student/resume-analysis', icon: BarChart2, label: 'Resume Analysis' },
  { to: '/student/internships', icon: Search, label: 'Find Internships' },
  { to: '/student/saved', icon: Star, label: 'Saved Internships' },
  { to: '/student/applications', icon: SendHorizonal, label: 'My Applications' },
]

const aiItems = [
  { to: '/student/skill-gap', icon: BookOpen, label: 'Skill Gap Analysis' },
  { to: '/student/roadmap', icon: Map, label: 'Career Roadmap' },
  { to: '/student/recommendations', icon: Compass, label: 'Career Recommendations' },
]

const bottomItems = [
  { to: '/student/notifications', icon: Bell, label: 'Notifications' },
  { to: '/student/settings', icon: Settings, label: 'Settings' },
]

export function StudentSidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const student = user as StudentUser | null

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <aside className="w-64 shrink-0 bg-brand-950 border-r border-white/10 flex flex-col h-full overflow-y-auto text-slate-300">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-16 border-b border-white/10 shrink-0">
        <div className="w-7 h-7 bg-brand-gradient rounded-lg flex items-center justify-center shadow-glow">
          <Briefcase className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-white">CareerBridge AI</span>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-600/40 ring-2 ring-accent-500/30 flex items-center justify-center text-white font-semibold text-sm shrink-0">
            {student?.firstName?.[0] ?? 'S'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {student ? `${student.firstName} ${student.lastName}` : 'Student'}
            </p>
            <p className="text-xs text-slate-400 truncate">{student?.email ?? ''}</p>
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
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-white/10 text-white border border-white/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}

        <p className="px-3 pt-4 pb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          AI Tools
        </p>

        {aiItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-white/10 text-white border border-white/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        {bottomItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-white/10 text-white border border-white/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-300 hover:bg-red-500/10 w-full transition-colors duration-150"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  )
}

export default StudentSidebar
