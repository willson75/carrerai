import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { SendHorizonal, X } from 'lucide-react'
import { applicationApi } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { EmptyState } from '@/components/ui/EmptyState'
import { CardSkeleton } from '@/components/ui/Skeleton'
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS,
  formatRelativeDate,
} from '@/lib/utils'
import type { ApplicationStatus } from '@/types'

const statusOptions = [
  { value: '', label: 'All statuses' },
  ...Object.entries(APPLICATION_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l })),
]

export function MyApplications() {
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>('')
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['my-applications', statusFilter],
    queryFn: () =>
      applicationApi.list({
        status: statusFilter ? [statusFilter as ApplicationStatus] : undefined,
      }),
  })

  const withdrawMutation = useMutation({
    mutationFn: applicationApi.withdraw,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-applications'] })
      toast.success('Application withdrawn.')
    },
    onError: () => toast.error('Failed to withdraw application.'),
  })

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
          <p className="text-slate-500 mt-1">
            {data?.total ? `${data.total} application${data.total !== 1 ? 's' : ''}` : 'Track all your applications'}
          </p>
        </div>
        <div className="w-48">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | '')}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : !data?.data.length ? (
        <EmptyState
          icon={<SendHorizonal className="w-8 h-8" />}
          title="No applications found"
          description={
            statusFilter
              ? `No applications with status "${APPLICATION_STATUS_LABELS[statusFilter as ApplicationStatus]}".`
              : "You haven't applied to any internships yet."
          }
          action={
            !statusFilter ? (
              <Link to="/student/internships">
                <Button>Browse internships</Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-3">
          {data.data.map((app) => (
            <Card key={app.id} className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-semibold shrink-0">
                  {app.companyName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <Link
                        to={`/student/applications/${app.id}`}
                        className="font-semibold text-slate-900 hover:text-primary-600 transition-colors"
                      >
                        {app.internshipTitle}
                      </Link>
                      <p className="text-sm text-slate-500 mt-0.5">{app.companyName}</p>
                    </div>
                    <span className={`badge ${APPLICATION_STATUS_COLORS[app.status]} shrink-0`}>
                      {APPLICATION_STATUS_LABELS[app.status]}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                    <span>Applied {formatRelativeDate(app.appliedAt)}</span>
                    {app.matchScore && (
                      <span className="text-green-600 font-medium">{app.matchScore}% match</span>
                    )}
                  </div>
                </div>
                {(app.status === 'submitted' || app.status === 'under_review') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 shrink-0"
                    leftIcon={<X className="w-4 h-4" />}
                    onClick={() => withdrawMutation.mutate(app.id)}
                    isLoading={withdrawMutation.isPending}
                  >
                    Withdraw
                  </Button>
                )}
              </div>
            </Card>
          ))}

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <Button variant="secondary" size="sm">Previous</Button>
              <Button variant="secondary" size="sm">Next</Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MyApplications
