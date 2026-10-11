import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Briefcase, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { CompanySize } from '@/types'
import { COMPANY_SIZE_LABELS } from '@/lib/utils'

const schema = z
  .object({
    companyName: z.string().min(1, 'Company name is required'),
    email: z.string().email('Enter a valid email address'),
    industry: z.string().min(1, 'Industry is required'),
    size: z.enum(['startup', 'small', 'medium', 'large', 'enterprise']),
    location: z.string().min(1, 'Location is required'),
    contactPersonName: z.string().min(1, 'Contact name is required'),
    website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

const sizeOptions = (Object.keys(COMPANY_SIZE_LABELS) as CompanySize[]).map((k) => ({
  value: k,
  label: COMPANY_SIZE_LABELS[k],
}))

const industryOptions = [
  'Technology', 'Finance', 'Healthcare', 'Education', 'E-Commerce',
  'Manufacturing', 'Media & Entertainment', 'Consulting', 'Non-profit', 'Other',
].map((v) => ({ value: v, label: v }))

export function CompanyRegister() {
  const [showPw, setShowPw] = useState(false)
  const { registerCompany, isLoading } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    try {
      await registerCompany({
        companyName: data.companyName,
        email: data.email,
        industry: data.industry,
        size: data.size,
        location: data.location,
        contactPersonName: data.contactPersonName,
        website: data.website,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })
      toast.success('Company registered! Welcome to CareerBridge AI.')
      navigate('/company/dashboard')
    } catch {
      toast.error('Registration failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="hidden lg:flex w-1/2 bg-secondary-600 flex-col justify-between p-12">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg">CareerBridge AI</span>
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Find top talent with AI-powered candidate matching.
          </h2>
          <p className="text-purple-200">
            Post internships and connect with thousands of pre-screened, AI-matched candidates.
          </p>
        </div>
        <p className="text-purple-300 text-sm">© {new Date().getFullYear()} CareerBridge AI</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-secondary-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">CareerBridge AI</span>
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Register your company</h1>
          <p className="text-slate-500 mb-8">Post internships and find the best candidates.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Company name"
              placeholder="Acme Corp"
              error={errors.companyName?.message}
              {...register('companyName')}
            />

            <Input
              label="Business email"
              type="email"
              placeholder="hr@company.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Industry"
                options={industryOptions}
                placeholder="Select industry"
                error={errors.industry?.message}
                {...register('industry')}
              />
              <Select
                label="Company size"
                options={sizeOptions}
                placeholder="Select size"
                error={errors.size?.message}
                {...register('size')}
              />
            </div>

            <Input
              label="Headquarters location"
              placeholder="Lagos, Nigeria"
              error={errors.location?.message}
              {...register('location')}
            />

            <Input
              label="Contact person name"
              placeholder="HR Manager name"
              error={errors.contactPersonName?.message}
              {...register('contactPersonName')}
            />

            <Input
              label="Website (optional)"
              placeholder="https://company.com"
              type="url"
              error={errors.website?.message}
              {...register('website')}
            />

            <Input
              label="Password"
              type={showPw ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              error={errors.password?.message}
              rightIcon={
                <button type="button" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              {...register('password')}
            />

            <Input
              label="Confirm password"
              type="password"
              placeholder="Repeat your password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isSubmitting || isLoading}
            >
              Register company
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already registered?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default CompanyRegister
