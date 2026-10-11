import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { CheckCircle, X, MapPin, Clock } from 'lucide-react'
import { adminApi } from '@/lib/api'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDate, formatDeadline, INTERNSHIP_TYPE_LABELS } from '@/lib/utils'

export function InternshipModeration() {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-pending-internships'],
    queryFn: () => adminApi.getPendingInternships(),
  })

  const approveMutation = useMutation({
    mutationFn: adminApi.approveInternship,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-pending-internships'] })
      toast.success('Internship approved!')
    },
    onError: () => toast.error('Failed to approve.'),
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminApi.rejectInternship(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-pending-internships'] })
      toast.success('Internship rejected.')
    },
    onError: () => toast.error('Failed to reject.'),
  })

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Internship Moderation</h1>
        <p className="text-slate-400 mt-1">
          {data?.total ?? 0} internship{data?.total !== 1 ? 's' : ''} pending review
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-5 animate-pulse border border-slate-700">
              <div className="h-4 bg-slate-700 rounded w-1/2 mb-2" />
              <div className="h-3 bg-slate-700 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : !data?.data.length ? (
        <div className="bg-slate-800 rounded-xl border border-slate-700">
          <EmptyState
            icon={<CheckCircle className="w-8 h-8" />}
            title="No internships pending review"
            description="All internship submissions have been processed."
          />
        </div>
      ) : (
        <div className="space-y-4">
          {data.data.map((internship) => (
            <div key={internship.id} className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{internship.title}</h3>
                    <Badge variant="warning">Pending review</Badge>
                    <Badge variant="default">{INTERNSHIP_TYPE_LABELS[internship.type]}</Badge>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{internship.companyName}</p>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-2">{internship.description}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {internship.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Deadline: {formatDeadline(internship.applicationDeadline)}
                    </span>
                    <span>Posted {formatDate(internship.createdAt)}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="success"
                    leftIcon={<CheckCircle className="w-4 h-4" />}
                    onClick={() => approveMutation.mutate(internship.id)}
                    isLoading={approveMutation.isPending}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    leftIcon={<X className="w-4 h-4" />}
                    onClick={() => {
                      const reason = window.prompt('Rejection reason:') ?? 'Violates platform guidelines'
                      rejectMutation.mutate({ id: internship.id, reason })
                    }}
                    isLoading={rejectMutation.isPending}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default InternshipModeration
