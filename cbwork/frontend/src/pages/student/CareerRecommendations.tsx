import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Compass, TrendingUp, Users, ArrowRight } from 'lucide-react'
import { careerApi } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { CardSkeleton } from '@/components/ui/Skeleton'

export function CareerRecommendations() {
  const { data: recommendations = [], isLoading } = useQuery({
    queryKey: ['career-recommendations'],
    queryFn: careerApi.getRecommendations,
  })

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Career Recommendations</h1>
        <p className="text-slate-500 mt-1">
          AI-powered career paths matched to your skills and interests.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : recommendations.length === 0 ? (
        <EmptyState
          icon={<Compass className="w-8 h-8" />}
          title="No recommendations yet"
          description="Complete your profile and add your skills to get personalised career path recommendations."
        />
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <Card key={rec.title} className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{rec.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{rec.growthOutlook}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold text-primary-600">{rec.matchPercentage}%</p>
                  <p className="text-xs text-slate-500">match</p>
                </div>
              </div>

              <ProgressBar value={rec.matchPercentage} color="auto" className="mb-4" />

              <p className="text-sm text-slate-600 mb-4 leading-relaxed">{rec.description}</p>

              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <TrendingUp className="w-4 h-4 text-green-500 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Avg. salary</p>
                    <p className="font-medium">{rec.averageSalary ?? 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Users className="w-4 h-4 text-blue-500 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Companies hiring</p>
                    <p className="font-medium">{rec.companiesHiring.toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Key skills</p>
                  <div className="flex flex-wrap gap-1">
                    {rec.requiredSkills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="primary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                <Link to="/student/internships">
                  <button className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                    Find {rec.title} internships
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </Link>
                <span className="text-slate-200">·</span>
                <Link to="/student/skill-gap">
                  <button className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                    View skill gaps
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default CareerRecommendations
