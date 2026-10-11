import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { User, Save, Upload } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { studentApi } from '@/lib/api'
import { Card, CardHeader } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import type { StudentUser } from '@/types'

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  university: z.string().min(1, 'Required'),
  major: z.string().min(1, 'Required'),
  graduationYear: z.coerce.number().min(2020).max(2035),
  gpa: z.coerce.number().min(0).max(4).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().optional(),
  phoneNumber: z.string().optional(),
  linkedinUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  portfolioUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  skills: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function StudentProfile() {
  const { user, updateUser } = useAuth()
  const student = user as StudentUser | null
  const qc = useQueryClient()

  const { data: profile } = useQuery({
    queryKey: ['student-profile'],
    queryFn: studentApi.getProfile,
    initialData: user ?? undefined,
  })

  const { mutate, isPending } = useMutation({
    mutationFn: studentApi.updateProfile,
    onSuccess: (updated) => {
      updateUser(updated)
      qc.invalidateQueries({ queryKey: ['student-profile'] })
      toast.success('Profile updated!')
    },
    onError: () => toast.error('Failed to update profile.'),
  })

  const studentProfile = profile as StudentUser | undefined

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: {
      firstName: studentProfile?.firstName ?? '',
      lastName: studentProfile?.lastName ?? '',
      university: studentProfile?.university ?? '',
      major: studentProfile?.major ?? '',
      graduationYear: studentProfile?.graduationYear ?? new Date().getFullYear() + 1,
      gpa: studentProfile?.gpa,
      bio: studentProfile?.bio ?? '',
      location: studentProfile?.location ?? '',
      phoneNumber: studentProfile?.phoneNumber ?? '',
      linkedinUrl: studentProfile?.linkedinUrl ?? '',
      githubUrl: studentProfile?.githubUrl ?? '',
      portfolioUrl: studentProfile?.portfolioUrl ?? '',
      skills: studentProfile?.skills?.join(', ') ?? '',
    },
  })

  const onSubmit = (data: FormData) => {
    mutate({
      ...data,
      skills: data.skills
        ? data.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    })
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500 mt-1">Keep your profile complete to maximise your match score.</p>
      </div>

      {/* Completeness */}
      {student && (
        <Card className="p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold text-sm text-slate-900">Profile completeness</p>
              <p className="text-xs text-slate-500">Complete all sections for best results</p>
            </div>
            <span className="text-sm font-bold text-primary-600">
              {student.profileCompleteness ?? 0}%
            </span>
          </div>
          <ProgressBar value={student.profileCompleteness ?? 0} color="auto" />
        </Card>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic info */}
        <Card>
          <div className="p-6 border-b border-slate-100">
            <CardHeader
              title="Basic Information"
              description="Your personal and academic details"
              action={
                <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                  <User className="w-7 h-7" />
                </div>
              }
            />
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First name" error={errors.firstName?.message} {...register('firstName')} />
              <Input label="Last name" error={errors.lastName?.message} {...register('lastName')} />
            </div>
            <Input label="University" error={errors.university?.message} {...register('university')} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Major / Course" error={errors.major?.message} {...register('major')} />
              <Input
                label="Graduation year"
                type="number"
                error={errors.graduationYear?.message}
                {...register('graduationYear')}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="GPA (optional)"
                type="number"
                step="0.01"
                placeholder="3.80"
                error={errors.gpa?.message}
                {...register('gpa')}
              />
              <Input
                label="Location (optional)"
                placeholder="Lagos, Nigeria"
                error={errors.location?.message}
                {...register('location')}
              />
            </div>
            <Textarea
              label="Bio (optional)"
              placeholder="Tell companies a bit about yourself..."
              error={errors.bio?.message}
              {...register('bio')}
            />
          </div>
        </Card>

        {/* Skills */}
        <Card>
          <div className="p-6 border-b border-slate-100">
            <CardHeader title="Skills" description="Comma-separated list of your skills" />
          </div>
          <div className="p-6">
            <Input
              label="Skills"
              placeholder="React, Python, SQL, Communication..."
              hint="Separate skills with commas"
              error={errors.skills?.message}
              {...register('skills')}
            />
            {studentProfile?.skills && studentProfile.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {studentProfile.skills.map((skill) => (
                  <span key={skill} className="badge bg-primary-100 text-primary-700">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Contact & links */}
        <Card>
          <div className="p-6 border-b border-slate-100">
            <CardHeader title="Contact & Links" description="Ways for companies to learn more about you" />
          </div>
          <div className="p-6 space-y-4">
            <Input
              label="Phone number (optional)"
              type="tel"
              placeholder="+234 812 345 6789"
              {...register('phoneNumber')}
            />
            <Input
              label="LinkedIn profile"
              type="url"
              placeholder="https://linkedin.com/in/username"
              error={errors.linkedinUrl?.message}
              {...register('linkedinUrl')}
            />
            <Input
              label="GitHub profile"
              type="url"
              placeholder="https://github.com/username"
              error={errors.githubUrl?.message}
              {...register('githubUrl')}
            />
            <Input
              label="Portfolio / website"
              type="url"
              placeholder="https://yoursite.com"
              error={errors.portfolioUrl?.message}
              {...register('portfolioUrl')}
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            isLoading={isPending}
            disabled={!isDirty}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save changes
          </Button>
        </div>
      </form>
    </div>
  )
}

export default StudentProfile
