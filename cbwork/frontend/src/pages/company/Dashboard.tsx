import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ListChecks,
  Users,
  UserCheck,
  TrendingUp,
  ArrowRight,
  PlusCircle,
  Clock,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { companyApi, applicationApi } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS, formatRelativeDate } from '@/lib/utils'
import type { CompanyUser } from '@/types'

export function CompanyDashboard() {
  const { user } = useAuth()
  const company = user as CompanyUser | null

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['company-stats'],
    queryFn: companyApi.getStats,
  })

  const { data: recentApps, isLoading: appsLoading } = useQuery({
    queryKey: ['company-recent-applications'],
    queryFn: () => applicationApi.list({ pageSize: 5 }),
  })

  const statCards = [
    {
      label: 'Active Internships',
      value: stats?.activeInternships ?? '—',
      icon: ListChecks,
      color: 'text-primary-600 bg-primary-50',
      link: '/company/internships',
    },
    {
      label: 'Total Applications',
      value: stats?.totalApplications ?? '—',
      icon: Users,
      color: 'text-secondary-600 bg-secondary-50',
      link: '/company/applicants',
    },
    {
      label: 'Shortlisted',
      value: stats?.shortlistedCandidates ?? '—',
      icon: UserCheck,
      color: 'text-green-600 bg-green-50',
      link: '/company/shortlist',
    },
    {
      label: 'Acceptance Rate',
      value: stats ? `${stats.acceptanceRate}%` : '—',
      icon: TrendingUp,
      color: 'text-teal-600 bg-teal-50',
      link: '/company/applicants',
    },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {company?.companyName ?? 'Company'} 👋
          </h1>
          <p className="text-slate-500 mt-1">Here's your hiring overview.</p>
        </div>
        <Link to="/company/internships/create">
          <Button leftIcon={<PlusCircle className="w-4 h-4" />}>Post internship</Button>
        </Link>
      </div>

      {/* Verification banner */}
      {company && !company.isVerified && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-yellow-800">Company verification pending</p>
            <p className="text-xs text-yellow-600 mt-0.5">
              Your company is under review. You can still post internships but they will be visible after admin approval.
            </p>
          </div>
          <Badge variant="warning">Pending</Badge>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-3" />
                <div className="h-8 bg-slate-200 rounded w-1/3" />
              </div>
            ))
          : statCards.map(({ label, value, icon: Icon, color, link }) => (
              <Link key={label} to={link}>
                <Card hoverable className="p-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{value}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{label}</p>
                </Card>
              </Link>
            ))}
      </div>

      {/* Recent applications */}
      <Card>
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Recent Applications</h2>
          <Link to="/company/applicants">
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View all
            </Button>
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {appsLoading ? (
            <div className="p-6">
              <CardSkeleton />
            </div>
          ) : recentApps?.data.length ? (
            recentApps.data.map((app) => (
              <div key={app.id} className="flex items-center gap-4 p-4">
                <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm shrink-0">
                  {app.studentName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{app.studentName}</p>
                  <p className="text-xs text-slate-500 truncate">{app.internshipTitle}</p>
                </div>
                <span className={`badge ${APPLICATION_STATUS_COLORS[app.status]} shrink-0`}>
                  {APPLICATION_STATUS_LABELS[app.status]}
                </span>
                <span className="text-xs text-slate-400 shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatRelativeDate(app.appliedAt)}
                </span>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-sm text-slate-500">
              No applications yet.{' '}
              <Link to="/company/internships/create" className="text-primary-600 font-medium">
                Post your first internship
              </Link>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default CompanyDashboard
