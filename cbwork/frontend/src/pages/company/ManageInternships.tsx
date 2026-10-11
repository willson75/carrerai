import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { PlusCircle, Edit, Trash2, Eye, MapPin, Users, Clock } from 'lucide-react'
import { internshipApi } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDeadline, INTERNSHIP_TYPE_LABELS } from '@/lib/utils'

export function ManageInternships() {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const qc = useQueryClient()

  const { data: internships = [], isLoading } = useQuery({
    queryKey: ['company-internships'],
    queryFn: internshipApi.getCompanyInternships,
  })

  const deleteMutation = useMutation({
    mutationFn: internshipApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['company-internships'] })
      toast.success('Internship deleted.')
      setDeleteId(null)
    },
    onError: () => toast.error('Failed to delete internship.'),
  })

  const statusVariant = {
    active: 'success' as const,
    draft: 'default' as const,
    closed: 'danger' as const,
    paused: 'warning' as const,
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Internships</h1>
          <p className="text-slate-500 mt-1">
            {internships.length} internship{internships.length !== 1 ? 's' : ''} posted
          </p>
        </div>
        <Link to="/company/internships/create">
          <Button leftIcon={<PlusCircle className="w-4 h-4" />}>Post internship</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-3" />
              <div className="h-3 bg-slate-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : internships.length === 0 ? (
        <EmptyState
          icon={<PlusCircle className="w-8 h-8" />}
          title="No internships posted yet"
          description="Post your first internship to start receiving applications from talented students."
          action={
            <Link to="/company/internships/create">
              <Button leftIcon={<PlusCircle className="w-4 h-4" />}>Post first internship</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {internships.map((internship) => (
            <Card key={internship.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900">{internship.title}</h3>
                    <Badge variant={statusVariant[internship.status]}>{internship.status}</Badge>
                    <Badge variant="default">{INTERNSHIP_TYPE_LABELS[internship.type]}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {internship.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {internship.applicationCount} application{internship.applicationCount !== 1 ? 's' : ''}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Deadline: {formatDeadline(internship.applicationDeadline)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link to={`/company/applicants?internshipId=${internship.id}`}>
                    <Button variant="ghost" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                      Applicants
                    </Button>
                  </Link>
                  <Link to={`/company/internships/${internship.id}/edit`}>
                    <Button variant="ghost" size="sm" leftIcon={<Edit className="w-4 h-4" />}>
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                    leftIcon={<Trash2 className="w-4 h-4" />}
                    onClick={() => setDeleteId(internship.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete confirm modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete internship"
        description="Are you sure? This will permanently delete the internship and all its applications."
        size="sm"
      >
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            isLoading={deleteMutation.isPending}
            onClick={() => deleteId && deleteMutation.mutate(deleteId)}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default ManageInternships
