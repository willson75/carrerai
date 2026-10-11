import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Search, MapPin, Clock, Star, Filter, Briefcase, DollarSign } from 'lucide-react'
import { internshipApi } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { EmptyState } from '@/components/ui/EmptyState'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { formatDeadline, INTERNSHIP_TYPE_LABELS } from '@/lib/utils'
import type { InternshipFilters } from '@/types'

const typeOptions = [
  { value: '', label: 'All types' },
  ...Object.entries(INTERNSHIP_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l })),
]

const sortOptions = [
  { value: 'relevance', label: 'Most relevant' },
  { value: 'date', label: 'Latest posted' },
  { value: 'deadline', label: 'Deadline soon' },
  { value: 'stipend', label: 'Highest stipend' },
]

export function InternshipMarketplace() {
  const [filters, setFilters] = useState<InternshipFilters>({ page: 1, pageSize: 12 })
  const [showFilters, setShowFilters] = useState(false)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['internships', filters],
    queryFn: () => internshipApi.list(filters),
  })

  const saveMutation = useMutation({
    mutationFn: (id: string) => internshipApi.save(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['internships'] })
      toast.success('Saved!')
    },
  })

  const unsaveMutation = useMutation({
    mutationFn: (id: string) => internshipApi.unsave(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['internships'] })
      toast.success('Removed from saved.')
    },
  })

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setFilters((prev) => ({ ...prev, search: String(fd.get('search') ?? ''), page: 1 }))
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Find Internships</h1>
        <p className="text-slate-500 mt-1">
          {data?.total ? `${data.total} opportunities available` : 'Discover your next opportunity'}
        </p>
      </div>

      {/* Search + filters row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <Input
            name="search"
            placeholder="Search roles, companies, skills..."
            leftIcon={<Search className="w-4 h-4" />}
            defaultValue={filters.search ?? ''}
            className="flex-1"
          />
          <Button type="submit">Search</Button>
        </form>
        <Button
          variant="secondary"
          leftIcon={<Filter className="w-4 h-4" />}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters
        </Button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="card p-4 mb-4 grid sm:grid-cols-3 gap-4">
          <Select
            label="Type"
            options={typeOptions}
            value={filters.type?.[0] ?? ''}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                type: e.target.value ? [e.target.value as never] : undefined,
                page: 1,
              }))
            }
          />
          <Input
            label="Location"
            placeholder="Lagos, Remote..."
            defaultValue={filters.location ?? ''}
            onBlur={(e) => setFilters((prev) => ({ ...prev, location: e.target.value, page: 1 }))}
          />
          <Select
            label="Sort by"
            options={sortOptions}
            value={filters.sortBy ?? 'relevance'}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, sortBy: e.target.value as never, page: 1 }))
            }
          />
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : !data?.data.length ? (
        <EmptyState
          icon={<Briefcase className="w-8 h-8" />}
          title="No internships found"
          description="Try adjusting your search or filters."
        />
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.data.map((internship) => (
              <Card key={internship.id} hoverable className="p-5 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-semibold shrink-0">
                      {internship.companyName[0]}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">{internship.companyName}</p>
                      {internship.matchScore && (
                        <span className="text-xs font-semibold text-green-600">
                          {internship.matchScore}% match
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      if (internship.isSaved) {
                        unsaveMutation.mutate(internship.id)
                      } else {
                        saveMutation.mutate(internship.id)
                      }
                    }}
                    className="text-slate-300 hover:text-yellow-400 transition-colors shrink-0"
                    aria-label="Save internship"
                  >
                    <Star
                      className={`w-5 h-5 ${internship.isSaved ? 'text-yellow-400 fill-yellow-400' : ''}`}
                    />
                  </button>
                </div>

                <Link to={`/student/internships/${internship.id}`} className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-2 hover:text-primary-600 transition-colors">
                    {internship.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="default">{INTERNSHIP_TYPE_LABELS[internship.type]}</Badge>
                    {internship.stipend && (
                      <Badge variant="success">
                        ${internship.stipend.toLocaleString()}/mo
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-500">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      {internship.location}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      Deadline: {formatDeadline(internship.applicationDeadline)}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <DollarSign className="w-3 h-3" />
                      Duration: {internship.duration}
                    </p>
                  </div>
                </Link>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="secondary"
                size="sm"
                disabled={(filters.page ?? 1) <= 1}
                onClick={() => setFilters((p) => ({ ...p, page: (p.page ?? 1) - 1 }))}
              >
                Previous
              </Button>
              <span className="flex items-center text-sm text-slate-600 px-3">
                Page {filters.page} of {data.totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={(filters.page ?? 1) >= data.totalPages}
                onClick={() => setFilters((p) => ({ ...p, page: (p.page ?? 1) + 1 }))}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default InternshipMarketplace
