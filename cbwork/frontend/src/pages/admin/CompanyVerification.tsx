import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { ShieldCheck, X, Building2 } from 'lucide-react'
import { adminApi } from '@/lib/api'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDate } from '@/lib/utils'
import type { PendingCompanyVerification } from '@/types'

export function CompanyVerification() {
  const qc = useQueryClient()

  const { data: pending = [], isLoading } = useQuery({
    queryKey: ['admin-pending-verifications'],
    queryFn: adminApi.getPendingVerifications,
  })

  const verifyMutation = useMutation({
    mutationFn: adminApi.verifyCompany,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-pending-verifications'] })
      qc.invalidateQueries({ queryKey: ['admin-stats'] })
      toast.success('Company verified!')
    },
    onError: () => toast.error('Failed to verify company.'),
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminApi.rejectCompany(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-pending-verifications'] })
      toast.success('Company rejected.')
    },
    onError: () => toast.error('Failed to reject company.'),
  })

  const companies = pending as PendingCompanyVerification[]

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Company Verifications</h1>
        <p className="text-slate-400 mt-1">
          {companies.length} company{companies.length !== 1 ? 'ies' : ''} pending verification
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-5 animate-pulse border border-slate-700">
              <div className="h-4 bg-slate-700 rounded w-1/2 mb-2" />
              <div className="h-3 bg-slate-700 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : companies.length === 0 ? (
        <div className="bg-slate-800 rounded-xl border border-slate-700">
          <EmptyState
            icon={<ShieldCheck className="w-8 h-8" />}
            title="No pending verifications"
            description="All company verification requests have been processed."
          />
        </div>
      ) : (
        <div className="space-y-4">
          {companies.map((company) => (
            <div key={company.id} className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-lg shrink-0">
                  {company.companyName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{company.companyName}</h3>
                    <Badge variant="warning">Pending</Badge>
                  </div>
                  <p className="text-sm text-slate-400">{company.email}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
                    <span>{company.industry}</span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {company.size}
                    </span>
                    <span>{company.location}</span>
                    {company.website && (
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">
                        {company.website}
                      </a>
                    )}
                    <span>Registered {formatDate(company.createdAt)}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="success"
                    leftIcon={<ShieldCheck className="w-4 h-4" />}
                    onClick={() => verifyMutation.mutate(company.id)}
                    isLoading={verifyMutation.isPending}
                  >
                    Verify
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    leftIcon={<X className="w-4 h-4" />}
                    onClick={() => {
                      const reason = window.prompt('Reason for rejection (optional):') ?? 'Does not meet requirements'
                      rejectMutation.mutate({ id: company.id, reason })
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

export default CompanyVerification
