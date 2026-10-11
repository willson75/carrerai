import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  ArrowLeft,
  MapPin,
  Clock,
  Briefcase,
  Users,
  DollarSign,
  Star,
  SendHorizonal,
  Calendar,
  Building2,
} from 'lucide-react'
import { internshipApi, applicationApi, resumeApi } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { formatDate, formatDeadline, INTERNSHIP_TYPE_LABELS } from '@/lib/utils'

export function InternshipDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [applyOpen, setApplyOpen] = useState(false)
  const [resumeId, setResumeId] = useState('')
  const [coverLetter, setCoverLetter] = useState('')

  const { data: internship, isLoading } = useQuery({
    queryKey: ['internship', id],
    queryFn: () => internshipApi.get(id!),
    enabled: !!id,
  })

  const { data: resumes = [] } = useQuery({
    queryKey: ['resumes'],
    queryFn: resumeApi.list,
  })

  const applyMutation = useMutation({
    mutationFn: () =>
      applicationApi.apply({
        internshipId: id!,
        resumeId,
        coverLetter: coverLetter || undefined,
      }),
    onSuccess: () => {
      toast.success('Application submitted!')
      setApplyOpen(false)
      navigate('/student/applications')
    },
    onError: () => toast.error('Failed to submit application.'),
  })

  if (isLoading) return <PageLoader />
  if (!internship) return <div className="p-6 text-slate-500">Internship not found.</div>

  const resumeOptions = resumes.map((r) => ({ value: r.id, label: r.fileName }))

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back */}
      <Link
        to="/student/internships"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to internships
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xl shrink-0">
                {internship.companyName[0]}
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-slate-900">{internship.title}</h1>
                <p className="text-slate-500 mt-0.5">{internship.companyName}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="primary">{INTERNSHIP_TYPE_LABELS[internship.type]}</Badge>
                  {internship.matchScore && (
                    <Badge variant="success">{internship.matchScore}% match</Badge>
                  )}
                  {internship.isVerified && <Badge variant="teal">Verified</Badge>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-100 text-sm">
              {[
                { icon: MapPin, label: internship.location },
                { icon: Clock, label: internship.duration },
                { icon: Users, label: `${internship.openings} opening${internship.openings !== 1 ? 's' : ''}` },
                { icon: DollarSign, label: internship.stipend ? `$${internship.stipend.toLocaleString()}/mo` : 'Unpaid' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-slate-600">
                  <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-xs">{label}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-slate-900 mb-3">Description</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{internship.description}</p>
          </Card>

          {internship.responsibilities.length > 0 && (
            <Card className="p-6">
              <h2 className="font-semibold text-slate-900 mb-3">Responsibilities</h2>
              <ul className="space-y-2">
                {internship.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {internship.requirements.length > 0 && (
            <Card className="p-6">
              <h2 className="font-semibold text-slate-900 mb-3">Requirements</h2>
              <ul className="space-y-2">
                {internship.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-500 mt-2 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {internship.skills.length > 0 && (
            <Card className="p-6">
              <h2 className="font-semibold text-slate-900 mb-3">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {internship.skills.map((skill) => (
                  <Badge key={skill} variant="default">{skill}</Badge>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="p-5">
            <Button
              className="w-full mb-3"
              size="lg"
              leftIcon={<SendHorizonal className="w-4 h-4" />}
              onClick={() => setApplyOpen(true)}
            >
              Apply now
            </Button>
            <Button variant="secondary" className="w-full" leftIcon={<Star className="w-4 h-4" />}>
              Save internship
            </Button>
          </Card>

          <Card className="p-5 space-y-3">
            <p className="font-semibold text-slate-900 text-sm">Details</p>
            {[
              { icon: Calendar, label: 'Deadline', value: formatDeadline(internship.applicationDeadline) },
              { icon: Clock, label: 'Duration', value: internship.duration },
              { icon: Briefcase, label: 'Type', value: INTERNSHIP_TYPE_LABELS[internship.type] },
              { icon: Users, label: 'Openings', value: String(internship.openings) },
              { icon: Building2, label: 'Posted', value: formatDate(internship.createdAt) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </span>
                <span className="font-medium text-slate-900 text-xs">{value}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* Apply modal */}
      <Modal
        isOpen={applyOpen}
        onClose={() => setApplyOpen(false)}
        title="Apply for this internship"
        description={`${internship.title} at ${internship.companyName}`}
      >
        <div className="space-y-4">
          <Select
            label="Select resume"
            options={resumeOptions}
            placeholder="Choose your resume..."
            value={resumeId}
            onChange={(e) => setResumeId(e.target.value)}
          />
          <Textarea
            label="Cover letter (optional)"
            placeholder="Tell them why you're a great fit..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="min-h-[120px]"
          />
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setApplyOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={() => applyMutation.mutate()}
              isLoading={applyMutation.isPending}
              disabled={!resumeId}
            >
              Submit application
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default InternshipDetails
