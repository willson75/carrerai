import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { BookmarkCheck, Eye, SendHorizonal, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { applicationApi } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { formatRelativeDate } from '@/lib/utils'

export function ShortlistManagement() {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['company-shortlist'],
    queryFn: () => applicationApi.list({ status: ['shortlisted'] }),
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      applicationApi.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['company-shortlist'] })
      toast.success('Status updated.')
    },
    onError: () => toast.error('Failed to update status.'),
  })

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Shortlist</h1>
        <p className="text-slate-500 mt-1">
          {data?.total ? `${data.total} shortlisted candidate${data.total !== 1 ? 's' : ''}` : "Candidates you've shortlisted"}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : !data?.data.length ? (
        <EmptyState
          icon={<BookmarkCheck className="w-8 h-8" />}
          title="No shortlisted candidates"
          description="Shortlist promising candidates from the Applicant Management page."
        />
      ) : (
        <div className="space-y-3">
          {data.data.map((app) => (
            <Card key={app.id} className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-semibold shrink-0">
                  {app.studentName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900">{app.studentName}</p>
                  <p className="text-sm text-slate-500">{app.internshipTitle}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Shortlisted {formatRelativeDate(app.updatedAt)}
                    {app.matchScore && (
                      <span className="ml-2 text-green-600 font-medium">{app.matchScore}% match</span>
                    )}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0 flex-wrap">
                  <Link to={`/company/candidates/${app.studentId}`}>
                    <Button variant="secondary" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                      Profile
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    leftIcon={<SendHorizonal className="w-4 h-4" />}
                    onClick={() => updateStatusMutation.mutate({ id: app.id, status: 'offer_extended' })}
                    isLoading={updateStatusMutation.isPending}
                  >
                    Extend offer
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:bg-red-50"
                    leftIcon={<X className="w-4 h-4" />}
                    onClick={() => updateStatusMutation.mutate({ id: app.id, status: 'rejected' })}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default ShortlistManagement
