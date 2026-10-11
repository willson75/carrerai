import React, { useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Upload, Trash2, CheckCircle, FileText, Star } from 'lucide-react'
import { resumeApi } from '@/lib/api'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDate, formatFileSize } from '@/lib/utils'

export function ResumeManagement() {
  const fileRef = useRef<HTMLInputElement>(null)
  const qc = useQueryClient()

  const { data: resumes = [], isLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: resumeApi.list,
  })

  const uploadMutation = useMutation({
    mutationFn: resumeApi.upload,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resumes'] })
      toast.success('Resume uploaded!')
    },
    onError: () => toast.error('Upload failed. Check the file and try again.'),
  })

  const deleteMutation = useMutation({
    mutationFn: resumeApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resumes'] })
      toast.success('Resume deleted.')
    },
    onError: () => toast.error('Failed to delete resume.'),
  })

  const defaultMutation = useMutation({
    mutationFn: resumeApi.setDefault,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resumes'] })
      toast.success('Default resume updated.')
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5 MB.')
      return
    }
    uploadMutation.mutate(file)
    e.target.value = ''
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Resumes</h1>
          <p className="text-slate-500 mt-1">Upload and manage your resumes for applications.</p>
        </div>
        <Button
          leftIcon={<Upload className="w-4 h-4" />}
          onClick={() => fileRef.current?.click()}
          isLoading={uploadMutation.isPending}
        >
          Upload resume
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-slate-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-8 h-8" />}
          title="No resumes uploaded yet"
          description="Upload your first resume to start applying to internships. PDF, DOC, and DOCX files are supported (max 5 MB)."
          action={
            <Button
              leftIcon={<Upload className="w-4 h-4" />}
              onClick={() => fileRef.current?.click()}
            >
              Upload your first resume
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {resumes.map((resume) => (
            <Card key={resume.id} className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-900 truncate">{resume.fileName}</p>
                    {resume.isDefault && (
                      <span className="badge bg-primary-100 text-primary-700 shrink-0">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formatFileSize(resume.fileSize)} · Uploaded {formatDate(resume.uploadedAt)}
                  </p>
                  {resume.analysisScore !== undefined && (
                    <div className="flex items-center gap-1 mt-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600 font-medium">
                        ATS Score: {resume.analysisScore}%
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!resume.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Star className="w-4 h-4" />}
                      onClick={() => defaultMutation.mutate(resume.id)}
                      isLoading={defaultMutation.isPending}
                    >
                      Set default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    leftIcon={<Trash2 className="w-4 h-4" />}
                    onClick={() => deleteMutation.mutate(resume.id)}
                    isLoading={deleteMutation.isPending}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-500">
        <p className="font-medium text-slate-700 mb-1">Tips for a strong resume</p>
        <ul className="space-y-1 list-disc list-inside text-xs">
          <li>Use a clean, ATS-friendly format</li>
          <li>Include quantifiable achievements</li>
          <li>Tailor your resume for each role</li>
          <li>Keep it to 1–2 pages maximum</li>
        </ul>
      </div>
    </div>
  )
}

export default ResumeManagement
