import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Map, CheckCircle, Circle, BookOpen, ExternalLink } from 'lucide-react'
import { careerApi } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/ui/EmptyState'

const categoryColors: Record<string, string> = {
  skill: 'bg-primary-50 border-primary-200 text-primary-700',
  certification: 'bg-purple-50 border-purple-200 text-purple-700',
  project: 'bg-orange-50 border-orange-200 text-orange-700',
  experience: 'bg-green-50 border-green-200 text-green-700',
  education: 'bg-teal-50 border-teal-200 text-teal-700',
}

const priorityBadge = {
  high: 'danger' as const,
  medium: 'warning' as const,
  low: 'default' as const,
}

export function CareerRoadmap() {
  const qc = useQueryClient()

  const { data: roadmap = [], isLoading } = useQuery({
    queryKey: ['career-roadmap'],
    queryFn: careerApi.getRoadmap,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, isCompleted }: { id: string; isCompleted: boolean }) =>
      careerApi.updateRoadmapItem(id, isCompleted),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['career-roadmap'] })
      toast.success('Progress updated!')
    },
    onError: () => toast.error('Failed to update progress.'),
  })

  const completed = roadmap.filter((i) => i.isCompleted).length
  const total = roadmap.length
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Career Roadmap</h1>
        <p className="text-slate-500 mt-1">
          Your personalised step-by-step career development plan.
        </p>
      </div>

      {!isLoading && total > 0 && (
        <Card className="p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold text-slate-900">Overall progress</p>
              <p className="text-sm text-slate-500 mt-0.5">
                {completed} of {total} milestones completed
              </p>
            </div>
            <span className="text-2xl font-bold text-primary-600">{progress}%</span>
          </div>
          <ProgressBar value={progress} color="auto" />
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-3" />
              <div className="h-3 bg-slate-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : roadmap.length === 0 ? (
        <EmptyState
          icon={<Map className="w-8 h-8" />}
          title="No roadmap generated yet"
          description="Complete your profile to get a personalised career roadmap."
        />
      ) : (
        <div className="space-y-4">
          {roadmap.map((item, index) => (
            <div
              key={item.id}
              className={`card p-5 transition-all duration-150 ${item.isCompleted ? 'opacity-70' : ''}`}
            >
              <div className="flex items-start gap-4">
                {/* Step number / check */}
                <div className="shrink-0 flex flex-col items-center">
                  <button
                    onClick={() =>
                      updateMutation.mutate({ id: item.id, isCompleted: !item.isCompleted })
                    }
                    className="text-slate-300 hover:text-primary-600 transition-colors"
                    aria-label={item.isCompleted ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {item.isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>
                  {index < roadmap.length - 1 && (
                    <div className="w-px flex-1 min-h-4 bg-slate-200 mt-2" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3
                      className={`font-semibold ${item.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}
                    >
                      {item.title}
                    </h3>
                    <Badge variant={priorityBadge[item.priority]}>{item.priority}</Badge>
                    <span
                      className={`badge text-xs border ${categoryColors[item.category] ?? 'bg-slate-50 text-slate-600'}`}
                    >
                      {item.category}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-2">{item.description}</p>
                  <p className="text-xs text-slate-400">⏱ {item.timeframe}</p>

                  {item.resources && item.resources.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-slate-600 mb-2 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        Resources
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.resources.slice(0, 3).map((res) => (
                          <a
                            key={res.url}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 bg-primary-50 px-2 py-1 rounded-md"
                          >
                            {res.title}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CareerRoadmap
