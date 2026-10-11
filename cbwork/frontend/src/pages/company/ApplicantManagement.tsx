import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Users, UserCheck, X, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { applicationApi, internshipApi } from '@/lib/api'
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

export function ApplicantManagement() {
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>('')
  const [selectedInternship, setSelectedInternship] = useState('')
  const qc = useQueryClient()

  const { data: internships = [] } = useQuery({
    queryKey: ['company-internships'],
    queryFn: internshipApi.getCompanyInternships,
  })

  const internshipOptions = [
    { value: '', label: 'All internships' },
    ...internships.map((i) => ({ value: i.id, label: i.title })),
  ]

  const { data, isLoading } = useQuery({
    queryKey: ['company-applicants', selectedInternship, statusFilter],
    queryFn: () => {
      const status = statusFilter ? [statusFilter as ApplicationStatus] : undefined
      return selectedInternship
        ? applicationApi.getForInternship(selectedInternship, { status })
        : applicationApi.listForCompany({ status })
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      applicationApi.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['company-applicants'] })
      toast.success('Status updated.')
    },
    onError: () => toast.error('Failed to update status.'),
  })

  const shortlistMutation = useMutation({
    mutationFn: applicationApi.shortlist,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['company-applicants'] })
      toast.success('Candidate shortlisted.')
    },
  })

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Applicant Management</h1>
          <p className="text-slate-500 mt-1">
            {data?.total ? `${data.total} application${data.total !== 1 ? 's' : ''}` : 'Review and manage applicants'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        <Select
          options={internshipOptions}
          value={selectedInternship}
          onChange={(e) => setSelectedInternship(e.target.value)}
          placeholder="All internships"
        />
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | '')}
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : !data?.data.length ? (
        <EmptyState
          icon={<Users className="w-8 h-8" />}
          title="No applicants found"
          description="No applications match your current filters."
        />
      ) : (
        <div className="space-y-3">
          {data.data.map((app) => (
            <Card key={app.id} className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold shrink-0">
                  {app.studentName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-900">{app.studentName}</p>
                      <p className="text-sm text-slate-500">{app.internshipTitle}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`badge ${APPLICATION_STATUS_COLORS[app.status]}`}>
                        {APPLICATION_STATUS_LABELS[app.status]}
                      </span>
                      {app.matchScore && (
                        <span className="text-xs font-semibold text-green-600">{app.matchScore}% match</span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Applied {formatRelativeDate(app.appliedAt)}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Link to={`/company/candidates/${app.studentId}`}>
                      <Button variant="secondary" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                        View profile
                      </Button>
                    </Link>
                    {app.status !== 'shortlisted' && app.status !== 'rejected' && app.status !== 'accepted' && (
                      <Button
                        size="sm"
                        leftIcon={<UserCheck className="w-4 h-4" />}
                        onClick={() => shortlistMutation.mutate(app.id)}
                        isLoading={shortlistMutation.isPending}
                      >
                        Shortlist
                      </Button>
                    )}
                    {app.status !== 'rejected' && app.status !== 'accepted' && app.status !== 'withdrawn' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50"
                        leftIcon={<X className="w-4 h-4" />}
                        onClick={() => updateStatusMutation.mutate({ id: app.id, status: 'rejected' })}
                      >
                        Reject
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default ApplicantManagement
