import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Shield, Bell, User, Save } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Required'),
    newPassword: z.string().min(8, 'Min. 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type PasswordForm = z.infer<typeof passwordSchema>

export function StudentSettings() {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const [emailNotifs, setEmailNotifs] = useState({
    applicationUpdates: true,
    newMatches: true,
    deadlineReminders: true,
    weeklyDigest: false,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) })

  const onChangePassword = async (_data: PasswordForm) => {
    // API call would go here
    await new Promise((r) => setTimeout(r, 800))
    toast.success('Password changed successfully.')
    reset()
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account preferences and security.</p>
      </div>

      <div className="space-y-6">
        {/* Change password */}
        <Card>
          <div className="p-6 border-b border-slate-100">
            <CardHeader
              title="Change Password"
              description="Update your account password"
              action={<Shield className="w-5 h-5 text-slate-400" />}
            />
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4">
              <Input
                label="Current password"
                type={showCurrent ? 'text' : 'password'}
                error={errors.currentPassword?.message}
                rightIcon={
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} tabIndex={-1}>
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                {...register('currentPassword')}
              />
              <Input
                label="New password"
                type={showNew ? 'text' : 'password'}
                error={errors.newPassword?.message}
                rightIcon={
                  <button type="button" onClick={() => setShowNew(!showNew)} tabIndex={-1}>
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                {...register('newPassword')}
              />
              <Input
                label="Confirm new password"
                type="password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
              <div className="flex justify-end">
                <Button type="submit" isLoading={isSubmitting} leftIcon={<Save className="w-4 h-4" />}>
                  Change password
                </Button>
              </div>
            </form>
          </div>
        </Card>

        {/* Notification preferences */}
        <Card>
          <div className="p-6 border-b border-slate-100">
            <CardHeader
              title="Notification Preferences"
              description="Choose what you want to be notified about"
              action={<Bell className="w-5 h-5 text-slate-400" />}
            />
          </div>
          <div className="p-6 space-y-4">
            {(
              [
                { key: 'applicationUpdates' as const, label: 'Application status updates', description: 'When your application status changes' },
                { key: 'newMatches' as const, label: 'New internship matches', description: 'When new internships match your profile' },
                { key: 'deadlineReminders' as const, label: 'Deadline reminders', description: '48 hours before application deadlines' },
                { key: 'weeklyDigest' as const, label: 'Weekly digest', description: 'A weekly summary of your activity' },
              ]
            ).map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">{label}</p>
                  <p className="text-xs text-slate-500">{description}</p>
                </div>
                <button
                  onClick={() => {
                    setEmailNotifs((prev) => ({ ...prev, [key]: !prev[key] }))
                    toast.success('Preference updated.')
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    emailNotifs[key] ? 'bg-primary-600' : 'bg-slate-200'
                  }`}
                  aria-checked={emailNotifs[key]}
                  role="switch"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      emailNotifs[key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Danger zone */}
        <Card className="border-red-200">
          <div className="p-6 border-b border-red-100">
            <CardHeader title="Danger Zone" description="Irreversible account actions" />
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">Delete account</p>
                <p className="text-xs text-slate-500">
                  Permanently delete your account and all data. This cannot be undone.
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => toast.error('Please contact support to delete your account.')}
              >
                Delete account
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default StudentSettings
