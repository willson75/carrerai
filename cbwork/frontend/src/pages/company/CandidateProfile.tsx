import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { ArrowLeft, MapPin, GraduationCap, Calendar, Mail } from 'lucide-react'
import { companyApi, applicationApi } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { APPLICATION_STATUS_LABELS } from '@/lib/utils'

export function CandidateProfile() {
  const { studentId } = useParams<{ studentId: string }>()
  const qc = useQueryClient()

  const { data: candidate, isLoading, isError } = useQuery({
    queryKey: ['company-candidate', studentId],
    queryFn: () => companyApi.getStudentCandidate(studentId!),
    enabled: !!studentId,
  })

  const shortlistMutation = useMutation({
    mutationFn: async () => {
      const apps = await applicationApi.listForCompany()
      const app = apps.data.find((a) => a.studentId === studentId)
      if (!app) throw new Error('No application found')
      return applicationApi.shortlist(app.id)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['company-candidate', studentId] })
      toast.success('Candidate shortlisted.')
    },
    onError: () => toast.error('Could not update shortlist.'),
  })

  if (isLoading) return <PageLoader />
  if (isError || !candidate) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <EmptyState
          title="Candidate not found"
          description="This profile is unavailable or you do not have permission to view it."
        />
        <Link to="/company/applicants" className="text-sm text-primary-600 hover:underline mt-4 inline-block">
          Back to applicants
        </Link>
      </div>
    )
  }

  const initials = `${candidate.firstName[0] ?? ''}${candidate.lastName[0] ?? ''}`.toUpperCase()
  const statusLabel = candidate.applicationStatus
    ? APPLICATION_STATUS_LABELS[candidate.applicationStatus as keyof typeof APPLICATION_STATUS_LABELS] ??
      candidate.applicationStatus
    : null

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link
        to="/company/applicants"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to applicants
      </Link>

      <div className="space-y-6">
        <Card className="p-6 card-elevated border-0">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center text-white font-bold text-2xl shrink-0 shadow-md">
              {initials || '?'}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-slate-900">
                {candidate.firstName} {candidate.lastName}
              </h1>
              {candidate.email && (
                <p className="text-slate-500 text-sm mt-0.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  {candidate.email}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {candidate.major && <Badge variant="primary">{candidate.major}</Badge>}
                {candidate.matchScore != null && (
                  <Badge variant="success">{candidate.matchScore}% skill match</Badge>
                )}
                {statusLabel && <Badge variant="secondary">{statusLabel}</Badge>}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-sm border-t border-slate-100 pt-4">
            {candidate.university && (
              <div className="flex items-center gap-2 text-slate-600">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                {candidate.university}
              </div>
            )}
            {candidate.graduationYear && (
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4 text-slate-400" />
                Graduating {candidate.graduationYear}
              </div>
            )}
            {candidate.location && (
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400" />
                {candidate.location}
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold text-slate-900 mb-3">Skills</h2>
          {candidate.skills.length ? (
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <Badge key={skill} variant="default">
                  {skill}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No skills listed yet.</p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Profile completeness</h2>
          <ProgressBar value={candidate.profileCompleteness} color="auto" showValue label="Overall" />
        </Card>

        {candidate.bio && (
          <Card className="p-6">
            <h2 className="font-semibold text-slate-900 mb-3">Bio</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{candidate.bio}</p>
          </Card>
        )}

        <div className="flex gap-3">
          <Button
            className="flex-1"
            onClick={() => shortlistMutation.mutate()}
            isLoading={shortlistMutation.isPending}
          >
            Shortlist candidate
          </Button>
          {candidate.email && (
            <a href={`mailto:${candidate.email}`} className="flex-1">
              <Button variant="secondary" className="w-full">
                Contact via email
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default CandidateProfile
