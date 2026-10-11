import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { FileStack } from 'lucide-react'
import { adminApi } from '@/lib/api'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS, formatRelativeDate } from '@/lib/utils'

export function ApplicationOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-applications'],
    queryFn: adminApi.getApplicationOverview,
  })

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Application Overview</h1>
        <p className="text-slate-400 mt-1">
          {data?.total ? `${data.total} total applications` : 'Platform-wide application data'}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-4 animate-pulse border border-slate-700">
              <div className="h-4 bg-slate-700 rounded w-1/3 mb-2" />
              <div className="h-3 bg-slate-700 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : !data?.data.length ? (
        <div className="bg-slate-800 rounded-xl border border-slate-700">
          <EmptyState
            icon={<FileStack className="w-8 h-8" />}
            title="No applications found"
            description="No applications have been submitted on the platform yet."
          />
        </div>
      ) : (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Student</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Internship</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Company</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {data.data.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-750 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-white font-medium">{app.studentName}</p>
                        <p className="text-xs text-slate-500">{app.studentEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{app.internshipTitle}</td>
                    <td className="px-4 py-3 text-slate-300">{app.companyName}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${APPLICATION_STATUS_COLORS[app.status]}`}>
                        {APPLICATION_STATUS_LABELS[app.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {formatRelativeDate(app.appliedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApplicationOverview
