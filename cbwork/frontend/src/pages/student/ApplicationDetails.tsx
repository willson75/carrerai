import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Calendar, Building2, FileText, MessageSquare } from 'lucide-react'
import { applicationApi } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS,
  formatDate,
  formatRelativeDate,
} from '@/lib/utils'

const statusSteps = [
  'submitted',
  'under_review',
  'shortlisted',
  'interview_scheduled',
  'offer_extended',
  'accepted',
] as const

export function ApplicationDetails() {
  const { id } = useParams<{ id: string }>()

  const { data: application, isLoading } = useQuery({
    queryKey: ['application', id],
    queryFn: () => applicationApi.get(id!),
    enabled: !!id,
  })

  if (isLoading) return <PageLoader />
  if (!application) return <div className="p-6 text-slate-500">Application not found.</div>

  const currentStepIndex = statusSteps.indexOf(application.status as never)

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link
        to="/student/applications"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to applications
      </Link>

      <div className="space-y-6">
        {/* Header */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg shrink-0">
              {application.companyName[0]}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-slate-900">{application.internshipTitle}</h1>
              <p className="text-slate-500 mt-0.5">{application.companyName}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className={`badge ${APPLICATION_STATUS_COLORS[application.status]}`}>
                  {APPLICATION_STATUS_LABELS[application.status]}
                </span>
                {application.matchScore && (
                  <span className="text-xs text-green-600 font-medium">
                    {application.matchScore}% match
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Status tracker */}
        {currentStepIndex >= 0 && (
          <Card className="p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Application Progress</h2>
            <div className="flex items-center gap-1">
              {statusSteps.map((step, i) => {
                const isCompleted = i < currentStepIndex
                const isCurrent = i === currentStepIndex
                const isFuture = i > currentStepIndex
                return (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                          isCompleted
                            ? 'bg-green-500 border-green-500 text-white'
                            : isCurrent
                              ? 'bg-primary-600 border-primary-600 text-white'
                              : 'bg-white border-slate-200 text-slate-400'
                        }`}
                      >
                        {isCompleted ? '✓' : i + 1}
                      </div>
                      <p
                        className={`text-xs mt-1 text-center max-w-[60px] leading-tight ${
                          isCurrent ? 'text-primary-600 font-medium' : 'text-slate-400'
                        }`}
                      >
                        {APPLICATION_STATUS_LABELS[step]}
                      </p>
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mb-5 ${
                          i < currentStepIndex ? 'bg-green-400' : 'bg-slate-200'
                        }`}
                      />
                    )}
                  </React.Fragment>
                )
              })}
            </div>
          </Card>
        )}

        {/* Details */}
        <Card className="p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Application Details</h2>
          <div className="space-y-3 text-sm">
            {[
              { icon: Calendar, label: 'Applied', value: formatDate(application.appliedAt) },
              { icon: Calendar, label: 'Last updated', value: formatRelativeDate(application.updatedAt) },
              ...(application.interviewDate
                ? [{ icon: Calendar, label: 'Interview date', value: formatDate(application.interviewDate) }]
                : []),
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-500">{label}:</span>
                <span className="font-medium text-slate-900">{value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Cover letter */}
        {application.coverLetter && (
          <Card className="p-6">
            <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-400" />
              Cover Letter
            </h2>
            <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
              {application.coverLetter}
            </p>
          </Card>
        )}

        {/* Notes from company */}
        {application.notes && (
          <Card className="p-6 border-primary-200 bg-primary-50">
            <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary-500" />
              Notes from {application.companyName}
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">{application.notes}</p>
          </Card>
        )}
      </div>
    </div>
  )
}

export default ApplicationDetails
