import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  SendHorizonal,
  Star,
  User,
  Zap,
  ArrowRight,
  Briefcase,
  MapPin,
  Clock,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { studentApi, internshipApi, applicationApi } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS, formatRelativeDate, formatDeadline } from '@/lib/utils'
import type { StudentUser } from '@/types'

export function StudentDashboard() {
  const { user } = useAuth()
  const student = user as StudentUser | null

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['student-stats'],
    queryFn: studentApi.getStats,
  })

  const { data: applicationsData, isLoading: appsLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => applicationApi.list({ pageSize: 4 }),
  })

  const { data: recommended, isLoading: recLoading } = useQuery({
    queryKey: ['recommended-internships'],
    queryFn: internshipApi.getRecommended,
  })

  const statCards = [
    {
      label: 'Active Applications',
      value: stats?.activeApplications ?? '—',
      icon: SendHorizonal,
      color: 'text-primary-600 bg-primary-50',
      link: '/student/applications',
    },
    {
      label: 'Saved Internships',
      value: stats?.savedInternships ?? '—',
      icon: Star,
      color: 'text-yellow-600 bg-yellow-50',
      link: '/student/saved',
    },
    {
      label: 'Profile Complete',
      value: stats ? `${stats.profileCompleteness}%` : '—',
      icon: User,
      color: 'text-green-600 bg-green-50',
      link: '/student/profile',
    },
    {
      label: 'Avg Match Score',
      value: stats ? `${stats.averageMatchScore}%` : '—',
      icon: Zap,
      color: 'text-secondary-600 bg-secondary-50',
      link: '/student/internships',
    },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Good morning, {student?.firstName ?? 'there'}
        </h1>
        <p className="text-slate-500 mt-1">Here's what's happening with your job search today.</p>
      </div>

      {/* Stat cards */}
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
                <Card className="p-5 hover:shadow-md transition-shadow" hoverable>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{value}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{label}</p>
                </Card>
              </Link>
            ))}
      </div>

      {/* Profile completeness */}
      {stats && stats.profileCompleteness < 100 && (
        <Card className="p-5 mb-8 border-primary-200 bg-primary-50">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold text-slate-900 text-sm">Complete your profile</p>
              <p className="text-xs text-slate-500 mt-0.5">
                A complete profile gets 5× more internship matches.
              </p>
            </div>
            <Link to="/student/profile">
              <Button size="sm" variant="secondary">
                Complete now
              </Button>
            </Link>
          </div>
          <ProgressBar value={stats.profileCompleteness} color="primary" showValue />
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent applications */}
        <Card>
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Recent Applications</h2>
            <Link to="/student/applications">
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
            ) : applicationsData?.data.length ? (
              applicationsData.data.map((app) => (
                <Link
                  key={app.id}
                  to={`/student/applications/${app.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-semibold text-sm shrink-0">
                    {app.companyName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{app.internshipTitle}</p>
                    <p className="text-xs text-slate-500">{app.companyName}</p>
                  </div>
                  <span className={`badge ${APPLICATION_STATUS_COLORS[app.status]} shrink-0`}>
                    {APPLICATION_STATUS_LABELS[app.status]}
                  </span>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-sm text-slate-500">
                No applications yet.{' '}
                <Link to="/student/internships" className="text-primary-600 font-medium">
                  Browse internships
                </Link>
              </div>
            )}
          </div>
        </Card>

        {/* Recommended internships */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recommended for you</h2>
            <Link to="/student/internships">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                See all
              </Button>
            </Link>
          </div>
          {recLoading
            ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
            : (recommended ?? []).slice(0, 3).map((internship) => (
                <Link key={internship.id} to={`/student/internships/${internship.id}`}>
                  <Card hoverable className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-semibold shrink-0">
                        {internship.companyName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-slate-900 leading-tight">
                            {internship.title}
                          </p>
                          {internship.matchScore && (
                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full shrink-0">
                              {internship.matchScore}% match
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{internship.companyName}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {internship.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDeadline(internship.applicationDeadline)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
          {!recLoading && !recommended?.length && (
            <Card className="p-8 text-center">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">
                Complete your profile to get personalised recommendations.
              </p>
              <Link to="/student/profile" className="mt-3 inline-block">
                <Button size="sm" variant="secondary">
                  Update profile
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Browse internships', to: '/student/internships', icon: Briefcase },
          { label: 'Analyse resume', to: '/student/resume-analysis', icon: Zap },
          { label: 'Skill gap analysis', to: '/student/skill-gap', icon: User },
          { label: 'Career roadmap', to: '/student/roadmap', icon: ArrowRight },
        ].map(({ label, to, icon: Icon }) => (
          <Link key={label} to={to}>
            <Card
              hoverable
              className="p-4 flex flex-col items-center text-center gap-2"
            >
              <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-slate-700">{label}</span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default StudentDashboard
