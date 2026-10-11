import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BarChart2, TrendingUp, Users, Building2, FileStack } from 'lucide-react'
import { adminApi } from '@/lib/api'
import { formatNumber } from '@/lib/utils'

const periodOptions = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y', label: 'Last year' },
]

export function Analytics() {
  const [period, setPeriod] = useState('30d')

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin-analytics', period],
    queryFn: () => adminApi.getAnalytics(period),
  })

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminApi.getStats,
  })

  const metricCards = [
    { label: 'Total Users', value: (stats?.totalStudents ?? 0) + (stats?.totalCompanies ?? 0), icon: Users, color: 'text-primary-400' },
    { label: 'Total Internships', value: stats?.totalInternships ?? 0, icon: Building2, color: 'text-secondary-400' },
    { label: 'Total Applications', value: stats?.totalApplications ?? 0, icon: FileStack, color: 'text-green-400' },
    { label: 'Monthly Growth', value: `+${stats?.monthlyGrowth ?? 0}%`, icon: TrendingUp, color: 'text-teal-400' },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-slate-400 mt-1">Platform performance and growth metrics.</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {periodOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {metricCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <Icon className={`w-5 h-5 mb-3 ${color}`} />
            <p className="text-2xl font-bold text-white">
              {typeof value === 'number' ? formatNumber(value) : value}
            </p>
            <p className="text-sm text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Placeholder charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { title: 'User Registrations', description: 'New students and companies over time' },
          { title: 'Applications Filed', description: 'Daily application volume' },
          { title: 'Placement Rate', description: 'Students who received offers' },
          { title: 'Top Industries', description: 'Most active hiring sectors' },
        ].map(({ title, description }) => (
          <div key={title} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{description}</p>
              </div>
              <BarChart2 className="w-5 h-5 text-slate-600" />
            </div>
            {isLoading ? (
              <div className="h-40 bg-slate-700 rounded-lg animate-pulse" />
            ) : (
              <div className="h-40 flex items-end gap-2">
                {Array.from({ length: 12 }).map((_, i) => {
                  const height = Math.floor(Math.random() * 80) + 20
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-primary-600/60 hover:bg-primary-500/80 rounded-sm transition-colors"
                      style={{ height: `${height}%` }}
                    />
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Analytics
