import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Zap, Star } from 'lucide-react'
import { internshipApi, companyApi } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { EmptyState } from '@/components/ui/EmptyState'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { Link } from 'react-router-dom'

export function CandidateMatching() {
  const [selectedInternship, setSelectedInternship] = useState('')

  const { data: internships = [] } = useQuery({
    queryKey: ['company-internships'],
    queryFn: internshipApi.getCompanyInternships,
  })

  const { data: matches = [], isLoading } = useQuery({
    queryKey: ['candidate-matches', selectedInternship],
    queryFn: () => companyApi.getMatchedCandidates(selectedInternship),
    enabled: !!selectedInternship,
  })

  const internshipOptions = internships.map((i) => ({ value: i.id, label: i.title }))

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Candidate Matching</h1>
        <p className="text-slate-500 mt-1">
          AI-powered matching surfaces the best candidates for each of your internships.
        </p>
      </div>

      <div className="mb-6">
        <Select
          label="Select internship"
          options={internshipOptions}
          placeholder="Choose an internship to see matches..."
          value={selectedInternship}
          onChange={(e) => setSelectedInternship(e.target.value)}
        />
      </div>

      {!selectedInternship ? (
        <EmptyState
          icon={<Zap className="w-8 h-8" />}
          title="Select an internship"
          description="Choose an internship above to see AI-matched candidates ranked by compatibility."
        />
      ) : isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : matches.length === 0 ? (
        <EmptyState
          icon={<Zap className="w-8 h-8" />}
          title="No matches found"
          description="No candidates match this internship yet. Share it to attract more applicants."
        />
      ) : (
        <div className="space-y-3">
          {matches.map((match, index) => (
            <Card key={match.id} className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold shrink-0 relative">
                  {match.studentName[0]}
                  {index < 3 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Star className="w-2.5 h-2.5 text-white fill-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-slate-900">{match.studentName}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      {match.matchScore && (
                        <span className="text-sm font-bold text-green-600">
                          {match.matchScore}% match
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-slate-500">{match.studentEmail}</p>
                </div>
                <Link to={`/company/candidates/${match.studentId}`}>
                  <Button variant="secondary" size="sm">View profile</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default CandidateMatching
