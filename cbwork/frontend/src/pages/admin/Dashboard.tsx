import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Users, Building2, ListChecks, FileStack, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react'
import { adminApi } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { formatNumber } from '@/lib/utils'

export function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminApi.getStats,
  })

  const statCards = [
    { label: 'Total Students', value: stats?.totalStudents, icon: Users, color: 'text-primary-600 bg-primary-50', link: '/admin/users' },
    { label: 'Total Companies', value: stats?.totalCompanies, icon: Building2, color: 'text-secondary-600 bg-secondary-50', link: '/admin/users?role=company' },
    { label: 'Internships', value: stats?.totalInternships, icon: ListChecks, color: 'text-teal-600 bg-teal-50', link: '/admin/internships' },
    { label: 'Applications', value: stats?.totalApplications, icon: FileStack, color: 'text-green-600 bg-green-50', link: '/admin/applications' },
    { label: 'Pending Verifications', value: stats?.pendingVerifications, icon: ShieldCheck, color: 'text-orange-600 bg-orange-50', link: '/admin/verifications' },
    { label: 'Active Users (30d)', value: stats?.activeUsers, icon: TrendingUp, color: 'text-blue-600 bg-blue-50', link: '/admin/analytics' },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400 mt-1">Platform overview and key metrics.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-slate-800 rounded-xl p-5 animate-pulse border border-slate-700">
                <div className="h-4 bg-slate-700 rounded w-1/2 mb-3" />
                <div className="h-8 bg-slate-700 rounded w-1/3" />
              </div>
            ))
          : statCards.map(({ label, value, icon: Icon, color, link }) => (
              <Link key={label} to={link}>
                <div className="bg-slate-800 hover:bg-slate-750 rounded-xl p-5 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {value !== undefined ? formatNumber(value) : '—'}
                  </p>
                  <p className="text-sm text-slate-400 mt-0.5">{label}</p>
                </div>
              </Link>
            ))}
      </div>

      {/* Monthly growth */}
      {stats && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Growth</h2>
              <Badge variant="success">+{stats.monthlyGrowth}% this month</Badge>
            </div>
            <p className="text-slate-400 text-sm">
              Platform is growing steadily. {formatNumber(stats.activeUsers)} users active in the last 30 days.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Pending Actions</h2>
            </div>
            <div className="space-y-3">
              <Link to="/admin/verifications">
                <div className="flex items-center justify-between py-2 hover:bg-slate-700 px-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-orange-400" />
                    <span className="text-sm text-slate-300">Company verifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="warning">{stats.pendingVerifications}</Badge>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
