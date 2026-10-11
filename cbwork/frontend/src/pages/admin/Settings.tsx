import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Shield, Bell, Database, Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function AdminSettings() {
  const [platformSettings, setPlatformSettings] = useState({
    allowRegistrations: true,
    requireEmailVerification: true,
    autoApproveInternships: false,
    maintenanceMode: false,
  })

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.careerbridge.ai',
    smtpPort: '587',
    fromEmail: 'noreply@careerbridge.ai',
  })

  const toggleSetting = (key: keyof typeof platformSettings) => {
    setPlatformSettings((prev) => ({ ...prev, [key]: !prev[key] }))
    toast.success('Setting updated.')
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
        <p className="text-slate-400 mt-1">Configure global platform behaviour and preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Platform toggles */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary-400" />
              <div>
                <p className="font-semibold text-white">Platform Controls</p>
                <p className="text-xs text-slate-500">Core platform settings</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-5">
            {(
              [
                { key: 'allowRegistrations' as const, label: 'Allow new registrations', description: 'Enable or disable new user sign-ups' },
                { key: 'requireEmailVerification' as const, label: 'Require email verification', description: 'Users must verify their email before logging in' },
                { key: 'autoApproveInternships' as const, label: 'Auto-approve internships', description: 'Skip manual review for new internship listings' },
                { key: 'maintenanceMode' as const, label: 'Maintenance mode', description: 'Take the platform offline for maintenance' },
              ]
            ).map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-xs text-slate-500">{description}</p>
                </div>
                <button
                  onClick={() => toggleSetting(key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    platformSettings[key] ? 'bg-primary-600' : 'bg-slate-600'
                  }`}
                  role="switch"
                  aria-checked={platformSettings[key]}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      platformSettings[key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Email settings */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-secondary-400" />
              <div>
                <p className="font-semibold text-white">Email Configuration</p>
                <p className="text-xs text-slate-500">SMTP settings for outbound emails</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">SMTP Host</label>
                <input
                  value={emailSettings.smtpHost}
                  onChange={(e) => setEmailSettings((p) => ({ ...p, smtpHost: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">SMTP Port</label>
                <input
                  value={emailSettings.smtpPort}
                  onChange={(e) => setEmailSettings((p) => ({ ...p, smtpPort: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">From Email</label>
              <input
                value={emailSettings.fromEmail}
                onChange={(e) => setEmailSettings((p) => ({ ...p, fromEmail: e.target.value }))}
                className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex justify-end">
              <Button
                leftIcon={<Save className="w-4 h-4" />}
                onClick={() => toast.success('Email settings saved.')}
              >
                Save settings
              </Button>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-slate-800 rounded-xl border border-red-900/50 overflow-hidden">
          <div className="p-6 border-b border-red-900/30">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-red-400" />
              <div>
                <p className="font-semibold text-white">Danger Zone</p>
                <p className="text-xs text-slate-500">Irreversible platform actions</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Clear test data</p>
                <p className="text-xs text-slate-500">Remove all test/seed data from the platform</p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => toast.error('Action disabled in production.')}
              >
                Clear data
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings
