import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { BarChart2, Zap, CheckCircle, AlertCircle, FileText } from 'lucide-react'
import { resumeApi } from '@/lib/api'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Select'
import { EmptyState } from '@/components/ui/EmptyState'

export function ResumeAnalysis() {
  const [selectedResumeId, setSelectedResumeId] = useState('')

  const { data: resumes = [], isLoading: resumesLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: resumeApi.list,
  })

  const analysisMutation = useMutation({
    mutationFn: () => resumeApi.analyze(selectedResumeId),
    onError: () => toast.error('Analysis failed. Please try again.'),
  })

  const analysis = analysisMutation.data

  const resumeOptions = resumes.map((r) => ({ value: r.id, label: r.fileName }))

  const handleAnalyze = () => {
    if (!selectedResumeId) {
      toast.error('Please select a resume first.')
      return
    }
    analysisMutation.mutate()
  }

  const sectionLabels: Record<string, string> = {
    contact: 'Contact Info',
    summary: 'Summary / Objective',
    experience: 'Work Experience',
    education: 'Education',
    skills: 'Skills',
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Resume Analysis</h1>
        <p className="text-slate-500 mt-1">
          Get AI-powered feedback and your ATS compatibility score.
        </p>
      </div>

      {/* Select & Analyze */}
      <Card className="p-6 mb-6">
        <CardHeader title="Analyse your resume" description="Select a resume to get started" />
        <div className="flex items-end gap-4 mt-4">
          {resumesLoading ? (
            <div className="flex-1 h-10 bg-slate-200 animate-pulse rounded-lg" />
          ) : (
            <div className="flex-1">
              <Select
                label="Select resume"
                options={resumeOptions}
                placeholder="Choose a resume..."
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
              />
            </div>
          )}
          <Button
            onClick={handleAnalyze}
            isLoading={analysisMutation.isPending}
            leftIcon={<Zap className="w-4 h-4" />}
          >
            Analyse
          </Button>
        </div>
      </Card>

      {resumes.length === 0 && !resumesLoading && (
        <EmptyState
          icon={<FileText className="w-8 h-8" />}
          title="No resumes found"
          description="Upload a resume first to get it analysed."
        />
      )}

      {/* Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Score overview */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-5 text-center">
              <p className="text-4xl font-bold text-primary-600 mb-1">{analysis.overallScore}</p>
              <p className="text-sm text-slate-500">Overall Score</p>
              <ProgressBar value={analysis.overallScore} color="auto" className="mt-3" />
            </Card>
            <Card className="p-5 text-center">
              <p className="text-4xl font-bold text-green-600 mb-1">{analysis.atsCompatibility}</p>
              <p className="text-sm text-slate-500">ATS Compatibility</p>
              <ProgressBar value={analysis.atsCompatibility} color="success" className="mt-3" />
            </Card>
            <Card className="p-5 text-center">
              <p className="text-4xl font-bold text-secondary-600 mb-1">{analysis.readabilityScore}</p>
              <p className="text-sm text-slate-500">Readability</p>
              <ProgressBar value={analysis.readabilityScore} color="primary" className="mt-3" />
            </Card>
          </div>

          {/* Section breakdown */}
          <Card>
            <div className="p-6 border-b border-slate-100">
              <CardHeader title="Section Breakdown" description="Scores for each resume section" />
            </div>
            <div className="p-6 space-y-4">
              {Object.entries(analysis.sections).map(([key, section]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">
                      {sectionLabels[key] ?? key}
                    </span>
                    <span className="text-sm font-bold text-slate-900">{section.score}/100</span>
                  </div>
                  <ProgressBar value={section.score} color="auto" size="sm" />
                  {section.feedback.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {section.feedback.map((fb, i) => (
                        <li key={i} className="text-xs text-slate-500 flex items-start gap-1.5">
                          <AlertCircle className="w-3 h-3 text-yellow-500 mt-0.5 shrink-0" />
                          {fb}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Keywords */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-5">
              <p className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" /> Detected keywords
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.keywords.map((kw) => (
                  <Badge key={kw} variant="success">{kw}</Badge>
                ))}
              </div>
            </Card>
            <Card className="p-5">
              <p className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-500" /> Missing keywords
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.missingKeywords.map((kw) => (
                  <Badge key={kw} variant="warning">{kw}</Badge>
                ))}
              </div>
            </Card>
          </div>

          {/* Suggestions */}
          <Card>
            <div className="p-6 border-b border-slate-100">
              <CardHeader title="AI Suggestions" description="Actionable improvements to boost your score" />
            </div>
            <div className="p-6 space-y-3">
              {analysis.suggestions.map((suggestion, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-slate-700">{suggestion}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default ResumeAnalysis
