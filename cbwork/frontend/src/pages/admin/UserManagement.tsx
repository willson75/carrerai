import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Search, UserX, UserCheck } from 'lucide-react'
import { adminApi } from '@/lib/api'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatDate } from '@/lib/utils'
import type { AdminUserListItem } from '@/types'

const roleOptions = [
  { value: '', label: 'All users' },
  { value: 'student', label: 'Students' },
  { value: 'company', label: 'Companies' },
]

export function UserManagement() {
  const [roleFilter, setRoleFilter] = useState('')
  const [search, setSearch] = useState('')
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', roleFilter, search],
    queryFn: () => adminApi.getUsers({ role: roleFilter || undefined, search: search || undefined }),
  })

  const banMutation = useMutation({
    mutationFn: adminApi.banUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('User banned.')
    },
  })

  const activateMutation = useMutation({
    mutationFn: adminApi.activateUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('User activated.')
    },
  })

  const roleVariant = {
    student: 'primary' as const,
    company: 'secondary' as const,
    admin: 'default' as const,
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <p className="text-slate-400 mt-1">
          {data?.total ? `${data.total} users` : 'Manage all platform users'}
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-w-[140px]"
        >
          {roleOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-4 animate-pulse border border-slate-700">
              <div className="h-4 bg-slate-700 rounded w-1/3 mb-2" />
              <div className="h-3 bg-slate-700 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : !data?.data.length ? (
        <div className="text-center py-12 text-slate-500">No users found.</div>
      ) : (
        <div className="space-y-2">
          {data.data.map((user: AdminUserListItem) => {
            const displayName =
              user.role === 'admin'
                ? user.email.split('@')[0]
                : user.email

            return (
              <div key={user.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-semibold shrink-0">
                  {displayName[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{displayName}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
                <Badge variant={roleVariant[user.role]}>{user.role}</Badge>
                <span className="text-xs text-slate-500 shrink-0">
                  Joined {formatDate(user.createdAt)}
                </span>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    leftIcon={<UserX className="w-4 h-4" />}
                    onClick={() => banMutation.mutate(user.id)}
                    isLoading={banMutation.isPending}
                  >
                    Ban
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-green-400 hover:text-green-300 hover:bg-green-900/20"
                    leftIcon={<UserCheck className="w-4 h-4" />}
                    onClick={() => activateMutation.mutate(user.id)}
                    isLoading={activateMutation.isPending}
                  >
                    Activate
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default UserManagement
