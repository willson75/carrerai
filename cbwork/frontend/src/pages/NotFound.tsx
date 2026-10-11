import React from 'react'
import { Link } from 'react-router-dom'
import { SearchX, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
          <SearchX className="w-10 h-10" />
        </div>
        <h1 className="text-6xl font-bold text-slate-200 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Page not found</h2>
        <p className="text-slate-500 mb-8">
          Sorry, we couldn't find the page you were looking for. It may have been moved or
          deleted.
        </p>
        <Link to="/">
          <Button leftIcon={<Home className="w-4 h-4" />}>Back to home</Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
