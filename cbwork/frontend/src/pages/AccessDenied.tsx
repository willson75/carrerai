import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldOff, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function AccessDenied() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-400">
          <ShieldOff className="w-10 h-10" />
        </div>
        <h1 className="text-6xl font-bold text-slate-200 mb-4">403</h1>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Access denied</h2>
        <p className="text-slate-500 mb-8">
          You don't have permission to access this page. Please sign in with an account that has
          the required permissions.
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            variant="secondary"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(-1)}
          >
            Go back
          </Button>
          <Link to="/">
            <Button>Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AccessDenied
