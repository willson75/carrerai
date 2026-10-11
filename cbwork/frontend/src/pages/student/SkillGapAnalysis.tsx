import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, ExternalLink, AlertCircle } from 'lucide-react'
import { careerApi } from '@/lib/api'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { CardSkeleton } from '@/components/ui/Skeleton'

const importanceVariant = {
  high: 'danger' as const,
  medium: 'warning' as const,
  low: 'default' as const,
}

export function SkillGapAnalysis() {
  const { data: skillGaps = [], isLoading } = useQuery({
    queryKey: ['skill-gaps'],
    queryFn: () => careerApi.getSkillGaps(),
  })

  const highPriority = skillGaps.filter((s) => s.importance === 'high')
  const mediumPriority = skillGaps.filter((s) => s.importance === 'medium')
  const lowPriority = skillGaps.filter((s) => s.importance === 'low')

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Skill Gap Analysis</h1>
        <p className="text-slate-500 mt-1">
          Identify the skills you need to develop to reach your career goals.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : skillGaps.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-8 h-8" />}
          title="No skill gaps detected"
          description="Complete your profile and resume to get personalised skill gap analysis."
        />
      ) : (
        <div className="space-y-8">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-5 text-center border-red-200">
              <p className="text-3xl font-bold text-red-600 mb-1">{highPriority.length}</p>
              <p className="text-sm text-slate-500">High priority</p>
            </Card>
            <Card className="p-5 text-center border-yellow-200">
              <p className="text-3xl font-bold text-yellow-600 mb-1">{mediumPriority.length}</p>
              <p className="text-sm text-slate-500">Medium priority</p>
            </Card>
            <Card className="p-5 text-center border-slate-200">
              <p className="text-3xl font-bold text-slate-600 mb-1">{lowPriority.length}</p>
              <p className="text-sm text-slate-500">Low priority</p>
            </Card>
          </div>

          {/* Skill gap list */}
          {[
            { label: 'High Priority', items: highPriority, color: 'text-red-600 bg-red-50 border-red-100' },
            { label: 'Medium Priority', items: mediumPriority, color: 'text-yellow-600 bg-yellow-50 border-yellow-100' },
            { label: 'Low Priority', items: lowPriority, color: 'text-slate-600 bg-slate-50 border-slate-100' },
          ].map(({ label, items, color }) =>
            items.length > 0 ? (
              <div key={label}>
                <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-slate-400" />
                  {label}
                  <Badge variant={label.toLowerCase().includes('high') ? 'danger' : label.toLowerCase().includes('medium') ? 'warning' : 'default'}>
                    {items.length}
                  </Badge>
                </h2>
                <div className="space-y-4">
                  {items.map((gap) => (
                    <Card key={gap.skill} className={`border ${color.split(' ')[2]}`}>
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-slate-900">{gap.skill}</h3>
                              <Badge variant={importanceVariant[gap.importance]}>{gap.importance}</Badge>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{gap.category}</p>
                          </div>
                          <div className="text-right text-xs text-slate-500">
                            <p>Current: <span className="font-medium">{gap.currentLevel ?? 'None'}</span></p>
                            <p>Target: <span className="font-medium text-primary-600">{gap.requiredLevel}</span></p>
                          </div>
                        </div>

                        {gap.currentLevel && (
                          <ProgressBar
                            value={
                              gap.currentLevel === 'beginner' ? 25 :
                              gap.currentLevel === 'intermediate' ? 50 :
                              gap.currentLevel === 'advanced' ? 75 : 90
                            }
                            color="auto"
                            size="sm"
                            className="mb-3"
                          />
                        )}

                        {gap.resources.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-slate-600 mb-2 flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              Learning resources
                            </p>
                            <div className="space-y-2">
                              {gap.resources.slice(0, 3).map((resource) => (
                                <a
                                  key={resource.url}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100 hover:border-primary-200 transition-colors group"
                                >
                                  <div>
                                    <p className="text-xs font-medium text-slate-800 group-hover:text-primary-600">
                                      {resource.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <Badge variant={resource.isFree ? 'success' : 'default'}>
                                        {resource.isFree ? 'Free' : 'Paid'}
                                      </Badge>
                                      {resource.platform && (
                                        <span className="text-xs text-slate-400">{resource.platform}</span>
                                      )}
                                    </div>
                                  </div>
                                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-primary-500 shrink-0" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  )
}

export default SkillGapAnalysis
