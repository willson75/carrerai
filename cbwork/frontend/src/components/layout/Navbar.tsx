import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Briefcase, ChevronDown, LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface NavbarProps {
  variant?: 'default' | 'transparent'
}

export function Navbar({ variant = 'default' }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const onHero = variant === 'transparent'

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const getDashboardLink = () => {
    if (!user) return '/'
    if (user.role === 'student') return '/student/dashboard'
    if (user.role === 'company') return '/company/dashboard'
    if (user.role === 'admin') return '/admin/dashboard'
    return '/'
  }

  return (
    <nav
      className={cn(
        'sticky top-0 z-40',
        onHero
          ? 'absolute inset-x-0 bg-brand-950/80 backdrop-blur-md border-b border-white/10'
          : 'bg-white border-b border-slate-200'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-brand-gradient rounded-lg flex items-center justify-center shadow-glow">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className={cn('font-bold text-lg', onHero ? 'text-white' : 'text-slate-900')}>
              CareerBridge AI
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/about"
              className={cn(
                'text-sm font-medium transition-colors',
                onHero ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={cn(
                'text-sm font-medium transition-colors',
                onHero ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Contact
            </Link>
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={cn(
                    'flex items-center gap-2 text-sm font-medium',
                    onHero ? 'text-white' : 'text-slate-700 hover:text-slate-900'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm',
                      onHero ? 'bg-white/15 text-white' : 'bg-brand-100 text-brand-700'
                    )}
                  >
                    {user && 'firstName' in user
                      ? user.firstName[0]
                      : user && 'companyName' in user
                        ? user.companyName[0]
                        : 'A'}
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-lg py-1 z-50"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <Link
                      to={getDashboardLink()}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <hr className="my-1 border-slate-100" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm" leftIcon={<LogIn className="w-4 h-4" />}>
                    Sign in
                  </Button>
                </Link>
                <Link to="/register/student">
                  <Button size="sm" leftIcon={<UserPlus className="w-4 h-4" />}>
                    Get started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-slate-600 hover:text-slate-900"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <Link
            to="/about"
            className="block text-sm font-medium text-slate-700 py-2"
            onClick={() => setMobileOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="block text-sm font-medium text-slate-700 py-2"
            onClick={() => setMobileOpen(false)}
          >
            Contact
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to={getDashboardLink()}
                className="block text-sm font-medium text-slate-700 py-2"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className={cn('block text-sm font-medium text-red-600 py-2')}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="secondary" className="w-full" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link to="/register/student" onClick={() => setMobileOpen(false)}>
                <Button className="w-full" size="sm">
                  Get started
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
