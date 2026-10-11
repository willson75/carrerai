import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Save } from 'lucide-react'
import { internshipApi } from '@/lib/api'
import { Card, CardHeader } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { INTERNSHIP_TYPE_LABELS } from '@/lib/utils'
import type { InternshipType, ExperienceLevel } from '@/types'

const typeOptions = (Object.entries(INTERNSHIP_TYPE_LABELS) as [InternshipType, string][]).map(
  ([v, l]) => ({ value: v, label: l })
)

const levelOptions: { value: ExperienceLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

const schema = z.object({
  title: z.string().min(3, 'Required'),
  description: z.string().min(10, 'Required'),
  location: z.string().min(1, 'Required'),
  type: z.enum(['full-time', 'part-time', 'remote', 'hybrid', 'on-site']),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  duration: z.string().min(1, 'Required'),
  openings: z.coerce.number().min(1),
  applicationDeadline: z.string().min(1, 'Required'),
  startDate: z.string().optional(),
  stipend: z.coerce.number().optional(),
  skills: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function EditInternship() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: internship, isLoading } = useQuery({
    queryKey: ['internship', id],
    queryFn: () => internshipApi.get(id!),
    enabled: !!id,
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data: Partial<FormData>) => internshipApi.update(id!, {
      ...data,
      skills: data.skills ? data.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['company-internships'] })
      toast.success('Internship updated!')
      navigate('/company/internships')
    },
    onError: () => toast.error('Failed to update internship.'),
  })

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: internship
      ? {
          title: internship.title,
          description: internship.description,
          location: internship.location,
          type: internship.type,
          experienceLevel: internship.experienceLevel,
          duration: internship.duration,
          openings: internship.openings,
          applicationDeadline: internship.applicationDeadline.split('T')[0],
          startDate: internship.startDate?.split('T')[0] ?? '',
          stipend: internship.stipend,
          skills: internship.skills.join(', '),
        }
      : undefined,
  })

  if (isLoading) return <PageLoader />

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Edit Internship</h1>
        <p className="text-slate-500 mt-1">Update your internship listing.</p>
      </div>

      <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-6">
        <Card>
          <div className="p-6 border-b border-slate-100">
            <CardHeader title="Internship Details" />
          </div>
          <div className="p-6 space-y-4">
            <Input label="Title" error={errors.title?.message} {...register('title')} />
            <Textarea label="Description" className="min-h-[120px]" error={errors.description?.message} {...register('description')} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Location" error={errors.location?.message} {...register('location')} />
              <Select label="Type" options={typeOptions} error={errors.type?.message} {...register('type')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select label="Experience level" options={levelOptions} error={errors.experienceLevel?.message} {...register('experienceLevel')} />
              <Input label="Duration" error={errors.duration?.message} {...register('duration')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Openings" type="number" min={1} error={errors.openings?.message} {...register('openings')} />
              <Input label="Stipend (optional)" type="number" placeholder="USD/month" {...register('stipend')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Deadline" type="date" error={errors.applicationDeadline?.message} {...register('applicationDeadline')} />
              <Input label="Start date" type="date" {...register('startDate')} />
            </div>
            <Input
              label="Required skills"
              hint="Comma-separated"
              {...register('skills')}
            />
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" type="button" onClick={() => navigate('/company/internships')}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isPending} disabled={!isDirty} leftIcon={<Save className="w-4 h-4" />}>
            Save changes
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EditInternship
