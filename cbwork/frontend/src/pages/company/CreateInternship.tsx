import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { PlusCircle, Trash2 } from 'lucide-react'
import { internshipApi } from '@/lib/api'
import { Card, CardHeader } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { INTERNSHIP_TYPE_LABELS } from '@/lib/utils'
import type { InternshipType, ExperienceLevel } from '@/types'

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  location: z.string().min(1, 'Required'),
  type: z.enum(['full-time', 'part-time', 'remote', 'hybrid', 'on-site']),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  duration: z.string().min(1, 'Required'),
  openings: z.coerce.number().min(1, 'At least 1 opening required'),
  applicationDeadline: z.string().min(1, 'Required'),
  startDate: z.string().optional(),
  stipend: z.coerce.number().optional(),
  stipendCurrency: z.string().optional(),
  skills: z.string().min(1, 'Enter at least one skill'),
  requirements: z.array(z.object({ value: z.string().min(1) })),
  responsibilities: z.array(z.object({ value: z.string().min(1) })),
})

type FormData = z.infer<typeof schema>

const typeOptions = (Object.entries(INTERNSHIP_TYPE_LABELS) as [InternshipType, string][]).map(
  ([v, l]) => ({ value: v, label: l })
)

const levelOptions: { value: ExperienceLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

export function CreateInternship() {
  const navigate = useNavigate()

  const { mutate, isPending } = useMutation({
    mutationFn: internshipApi.create,
    onSuccess: () => {
      toast.success('Internship posted!')
      navigate('/company/internships')
    },
    onError: () => toast.error('Failed to post internship.'),
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'full-time',
      experienceLevel: 'beginner',
      openings: 1,
      requirements: [{ value: '' }],
      responsibilities: [{ value: '' }],
    },
  })

  const reqArray = useFieldArray({ control, name: 'requirements' })
  const respArray = useFieldArray({ control, name: 'responsibilities' })

  const onSubmit = (data: FormData) => {
    mutate({
      ...data,
      requirements: data.requirements.map((r) => r.value).filter(Boolean),
      responsibilities: data.responsibilities.map((r) => r.value).filter(Boolean),
      skills: data.skills.split(',').map((s) => s.trim()).filter(Boolean),
    })
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Post Internship</h1>
        <p className="text-slate-500 mt-1">Create a new internship listing to attract qualified candidates.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basics */}
        <Card>
          <div className="p-6 border-b border-slate-100">
            <CardHeader title="Basic Details" />
          </div>
          <div className="p-6 space-y-4">
            <Input label="Internship title" placeholder="e.g. Frontend Engineering Intern" error={errors.title?.message} {...register('title')} />
            <Textarea
              label="Description"
              placeholder="Describe the role, what the intern will work on, and why someone should apply..."
              className="min-h-[140px]"
              error={errors.description?.message}
              {...register('description')}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Location" placeholder="Lagos, Nigeria or Remote" error={errors.location?.message} {...register('location')} />
              <Select label="Internship type" options={typeOptions} error={errors.type?.message} {...register('type')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select label="Experience level" options={levelOptions} error={errors.experienceLevel?.message} {...register('experienceLevel')} />
              <Input label="Duration" placeholder="e.g. 3 months" error={errors.duration?.message} {...register('duration')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Number of openings" type="number" min={1} error={errors.openings?.message} {...register('openings')} />
              <div className="grid grid-cols-2 gap-2">
                <Input label="Stipend (optional)" type="number" placeholder="500" error={errors.stipend?.message} {...register('stipend')} />
                <Input label="Currency" placeholder="USD" {...register('stipendCurrency')} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Application deadline" type="date" error={errors.applicationDeadline?.message} {...register('applicationDeadline')} />
              <Input label="Start date (optional)" type="date" {...register('startDate')} />
            </div>
            <Input
              label="Required skills"
              placeholder="React, TypeScript, Git..."
              hint="Comma-separated list of skills"
              error={errors.skills?.message}
              {...register('skills')}
            />
          </div>
        </Card>

        {/* Responsibilities */}
        <Card>
          <div className="p-6 border-b border-slate-100">
            <CardHeader title="Responsibilities" description="What will the intern be doing?" />
          </div>
          <div className="p-6 space-y-3">
            {respArray.fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  placeholder={`Responsibility ${index + 1}`}
                  error={errors.responsibilities?.[index]?.value?.message}
                  {...register(`responsibilities.${index}.value`)}
                />
                {respArray.fields.length > 1 && (
                  <button type="button" onClick={() => respArray.remove(index)} className="text-red-500 hover:text-red-700 shrink-0 mt-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <Button type="button" variant="ghost" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />} onClick={() => respArray.append({ value: '' })}>
              Add responsibility
            </Button>
          </div>
        </Card>

        {/* Requirements */}
        <Card>
          <div className="p-6 border-b border-slate-100">
            <CardHeader title="Requirements" description="What qualifications does the intern need?" />
          </div>
          <div className="p-6 space-y-3">
            {reqArray.fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  placeholder={`Requirement ${index + 1}`}
                  error={errors.requirements?.[index]?.value?.message}
                  {...register(`requirements.${index}.value`)}
                />
                {reqArray.fields.length > 1 && (
                  <button type="button" onClick={() => reqArray.remove(index)} className="text-red-500 hover:text-red-700 shrink-0 mt-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <Button type="button" variant="ghost" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />} onClick={() => reqArray.append({ value: '' })}>
              Add requirement
            </Button>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate('/company/internships')}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isPending}>
            Post internship
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateInternship
