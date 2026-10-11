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

const currentYear = new Date().getFullYear()

const schema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Enter a valid email address'),
    university: z.string().min(1, 'University is required'),
    major: z.string().min(1, 'Major is required'),
    graduationYear: z.coerce
      .number()
      .min(currentYear, `Year must be ${currentYear} or later`)
      .max(currentYear + 8, 'Enter a realistic graduation year'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

const yearOptions = Array.from({ length: 9 }, (_, i) => ({
  value: String(currentYear + i),
  label: String(currentYear + i),
}))

export function StudentRegister() {
  const [showPw, setShowPw] = useState(false)
  const { registerStudent, isLoading } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    try {
      await registerStudent({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        university: data.university,
        major: data.major,
        graduationYear: data.graduationYear,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })
      toast.success('Account created! Welcome to CareerBridge AI.')
      navigate('/student/dashboard')
    } catch {
      toast.error('Registration failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="hidden lg:flex w-1/2 bg-primary-600 flex-col justify-between p-12">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg">CareerBridge AI</span>
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Join 12,000+ students already using CareerBridge AI.
          </h2>
          <p className="text-primary-200">
            Free forever for students. Discover internships tailored to you.
          </p>
        </div>
        <p className="text-primary-300 text-sm">© {new Date().getFullYear()} CareerBridge AI</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">CareerBridge AI</span>
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h1>
          <p className="text-slate-500 mb-8">Start your career journey today. It's free.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First name"
                placeholder="Jane"
                error={errors.firstName?.message}
                {...register('firstName')}
              />
              <Input
                label="Last name"
                placeholder="Doe"
                error={errors.lastName?.message}
                {...register('lastName')}
              />
            </div>

            <Input
              label="Email address"
              type="email"
              placeholder="jane@university.edu"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="University"
              placeholder="University of Lagos"
              error={errors.university?.message}
              {...register('university')}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Major / Course"
                placeholder="Computer Science"
                error={errors.major?.message}
                {...register('major')}
              />
              <Select
                label="Graduation year"
                options={yearOptions}
                placeholder="Select year"
                error={errors.graduationYear?.message}
                {...register('graduationYear')}
              />
            </div>

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
              Create account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </p>
          <p className="text-center text-sm text-slate-500 mt-3">
            Registering as a company?{' '}
            <Link to="/register/company" className="text-primary-600 hover:text-primary-700 font-medium">
              Company registration
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default StudentRegister
