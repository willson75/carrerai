import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Building2, Save, Globe, MapPin, Users } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { companyApi } from '@/lib/api'
import { Card, CardHeader } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { COMPANY_SIZE_LABELS } from '@/lib/utils'
import type { CompanyUser, CompanySize } from '@/types'

const sizeOptions = (Object.keys(COMPANY_SIZE_LABELS) as CompanySize[]).map((k) => ({
  value: k,
  label: COMPANY_SIZE_LABELS[k],
}))

const industryOptions = [
  'Technology', 'Finance', 'Healthcare', 'Education', 'E-Commerce',
  'Manufacturing', 'Media & Entertainment', 'Consulting', 'Non-profit', 'Other',
].map((v) => ({ value: v, label: v }))

const schema = z.object({
  companyName: z.string().min(1, 'Required'),
  industry: z.string().min(1, 'Required'),
  size: z.enum(['startup', 'small', 'medium', 'large', 'enterprise']),
  location: z.string().min(1, 'Required'),
  contactPersonName: z.string().min(1, 'Required'),
  contactPersonTitle: z.string().optional(),
  website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  description: z.string().max(1000).optional(),
})

type FormData = z.infer<typeof schema>

export function CompanyProfile() {
  const { user, updateUser } = useAuth()
  const qc = useQueryClient()

  const { data: profile } = useQuery({
    queryKey: ['company-profile'],
    queryFn: companyApi.getProfile,
    initialData: user ?? undefined,
  })

  const company = profile as CompanyUser | undefined

  const { mutate, isPending } = useMutation({
    mutationFn: companyApi.updateProfile,
    onSuccess: (updated) => {
      updateUser(updated)
      qc.invalidateQueries({ queryKey: ['company-profile'] })
      toast.success('Profile updated!')
    },
    onError: () => toast.error('Failed to update profile.'),
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: {
      companyName: company?.companyName ?? '',
      industry: company?.industry ?? '',
      size: company?.size ?? 'startup',
      location: company?.location ?? '',
      contactPersonName: company?.contactPersonName ?? '',
      contactPersonTitle: company?.contactPersonTitle ?? '',
      website: company?.website ?? '',
      description: company?.description ?? '',
    },
  })

  const onSubmit = (data: FormData) => mutate(data)

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Company Profile</h1>
          <p className="text-slate-500 mt-1">Manage your company's public information.</p>
        </div>
        {company?.isVerified ? (
          <Badge variant="success">Verified</Badge>
        ) : (
          <Badge variant="warning">Pending verification</Badge>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic info */}
        <Card>
          <div className="p-6 border-b border-slate-100">
            <CardHeader
              title="Company Information"
              action={
                <div className="w-14 h-14 rounded-xl bg-secondary-100 flex items-center justify-center text-secondary-700">
                  <Building2 className="w-7 h-7" />
                </div>
              }
            />
          </div>
          <div className="p-6 space-y-4">
            <Input label="Company name" error={errors.companyName?.message} {...register('companyName')} />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Industry"
                options={industryOptions}
                error={errors.industry?.message}
                {...register('industry')}
              />
              <Select
                label="Company size"
                options={sizeOptions}
                error={errors.size?.message}
                {...register('size')}
              />
            </div>
            <Input
              label="Headquarters"
              placeholder="Lagos, Nigeria"
              leftIcon={<MapPin className="w-4 h-4" />}
              error={errors.location?.message}
              {...register('location')}
            />
            <Input
              label="Website"
              type="url"
              placeholder="https://yourcompany.com"
              leftIcon={<Globe className="w-4 h-4" />}
              error={errors.website?.message}
              {...register('website')}
            />
            <Textarea
              label="Company description"
              placeholder="Tell candidates about your company culture, mission, and what makes you a great place to work..."
              error={errors.description?.message}
              className="min-h-[120px]"
              {...register('description')}
            />
          </div>
        </Card>

        {/* Contact */}
        <Card>
          <div className="p-6 border-b border-slate-100">
            <CardHeader title="Contact Person" description="Primary contact for CareerBridge AI" action={<Users className="w-5 h-5 text-slate-400" />} />
          </div>
          <div className="p-6 space-y-4">
            <Input label="Full name" error={errors.contactPersonName?.message} {...register('contactPersonName')} />
            <Input
              label="Job title (optional)"
              placeholder="HR Manager"
              error={errors.contactPersonTitle?.message}
              {...register('contactPersonTitle')}
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" isLoading={isPending} disabled={!isDirty} leftIcon={<Save className="w-4 h-4" />}>
            Save changes
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CompanyProfile
