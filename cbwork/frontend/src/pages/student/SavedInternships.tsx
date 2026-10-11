import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Star, MapPin, Clock, Briefcase } from 'lucide-react'
import { internshipApi } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { formatDeadline, INTERNSHIP_TYPE_LABELS } from '@/lib/utils'

export function SavedInternships() {
  const qc = useQueryClient()

  const { data: saved = [], isLoading } = useQuery({
    queryKey: ['saved-internships'],
    queryFn: internshipApi.getSaved,
  })

  const unsaveMutation = useMutation({
    mutationFn: internshipApi.unsave,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['saved-internships'] })
      toast.success('Removed from saved.')
    },
  })

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Saved Internships</h1>
        <p className="text-slate-500 mt-1">
          {saved.length
            ? `${saved.length} saved internship${saved.length !== 1 ? 's' : ''}`
            : "Internships you've saved for later"}
        </p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : saved.length === 0 ? (
        <EmptyState
          icon={<Star className="w-8 h-8" />}
          title="No saved internships"
          description="Save internships you're interested in to review them later."
          action={
            <Link to="/student/internships">
              <Button>Browse internships</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {saved.map((internship) => (
            <Card key={internship.id} hoverable className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-semibold shrink-0">
                  {internship.companyName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500">{internship.companyName}</p>
                  <Link to={`/student/internships/${internship.id}`}>
                    <h3 className="font-semibold text-slate-900 hover:text-primary-600 transition-colors truncate">
                      {internship.title}
                    </h3>
                  </Link>
                </div>
                <button
                  onClick={() => unsaveMutation.mutate(internship.id)}
                  className="text-yellow-400 hover:text-slate-300 transition-colors shrink-0"
                  aria-label="Remove from saved"
                >
                  <Star className="w-5 h-5 fill-yellow-400" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="default">{INTERNSHIP_TYPE_LABELS[internship.type]}</Badge>
                {internship.matchScore && (
                  <Badge variant="success">{internship.matchScore}% match</Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {internship.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDeadline(internship.applicationDeadline)}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <Link to={`/student/internships/${internship.id}`}>
                  <Button size="sm" className="w-full">View & Apply</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default SavedInternships
