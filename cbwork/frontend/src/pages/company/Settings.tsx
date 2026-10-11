import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Shield, Bell, Save } from 'lucide-react'
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

export function CompanySettings() {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const [notifPrefs, setNotifPrefs] = useState({
    newApplications: true,
    applicationUpdates: true,
    systemAlerts: false,
  })

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  })

  const onChangePassword = async (_data: PasswordForm) => {
    await new Promise((r) => setTimeout(r, 800))
    toast.success('Password changed successfully.')
    reset()
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your company account settings.</p>
      </div>

      <div className="space-y-6">
        <Card>
          <div className="p-6 border-b border-slate-100">
            <CardHeader title="Change Password" action={<Shield className="w-5 h-5 text-slate-400" />} />
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
              <Input label="Confirm new password" type="password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
              <div className="flex justify-end">
                <Button type="submit" isLoading={isSubmitting} leftIcon={<Save className="w-4 h-4" />}>
                  Change password
                </Button>
              </div>
            </form>
          </div>
        </Card>

        <Card>
          <div className="p-6 border-b border-slate-100">
            <CardHeader title="Notification Preferences" action={<Bell className="w-5 h-5 text-slate-400" />} />
          </div>
          <div className="p-6 space-y-4">
            {(
              [
                { key: 'newApplications' as const, label: 'New applications', description: 'When a candidate applies to your internship' },
                { key: 'applicationUpdates' as const, label: 'Application updates', description: 'When an application status changes' },
                { key: 'systemAlerts' as const, label: 'System alerts', description: 'Platform-level announcements and alerts' },
              ]
            ).map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">{label}</p>
                  <p className="text-xs text-slate-500">{description}</p>
                </div>
                <button
                  onClick={() => {
                    setNotifPrefs((prev) => ({ ...prev, [key]: !prev[key] }))
                    toast.success('Preference updated.')
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifPrefs[key] ? 'bg-secondary-600' : 'bg-slate-200'}`}
                  role="switch"
                  aria-checked={notifPrefs[key]}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifPrefs[key] ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default CompanySettings
