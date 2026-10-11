import type {
  AnyUser,
  Application,
  ApplicationStatus,
  CareerRecommendation,
  CareerRoadmapItem,
  CompanyUser,
  Internship,
  InternshipType,
  Notification,
  Resume,
  ResumeAnalysisData,
  SkillGap,
  StudentUser,
  AdminUser,
  StudentStats,
  CompanyStats,
  AdminStats,
  PaginatedResponse,
} from '@/types'

// ─── Helpers ───────────────────────────────────────────────────────────────────

export function toIso(d: string | Date | null | undefined): string {
  if (!d) return new Date().toISOString()
  return typeof d === 'string' ? d : d.toISOString()
}

function mapApplicationStatus(status: string): ApplicationStatus {
  if (status === 'offered') return 'offer_extended'
  return status as ApplicationStatus
}

function mapWorkModeToType(workMode: string): InternshipType {
  const m: Record<string, InternshipType> = {
    remote: 'remote',
    hybrid: 'hybrid',
    onsite: 'on-site',
  }
  return m[workMode] ?? 'on-site'
}

function mapTypeToWorkMode(type: InternshipType): string {
  const m: Record<InternshipType, string> = {
    remote: 'remote',
    hybrid: 'hybrid',
    'on-site': 'onsite',
    'full-time': 'onsite',
    'part-time': 'onsite',
  }
  return m[type] ?? 'onsite'
}

function mapInternshipStatus(status: string): Internship['status'] {
  if (status === 'published') return 'active'
  return status as Internship['status']
}

function parseDurationWeeks(duration: string): number | undefined {
  const n = parseInt(duration.replace(/\D/g, ''), 10)
  return Number.isFinite(n) ? n : undefined
}

// ─── Internship ────────────────────────────────────────────────────────────────

export function mapInternship(raw: Record<string, unknown>, extras?: Partial<Internship>): Internship {
  const skillsRaw = (raw.skills as { skill_name: string; requirement_type: string }[] | undefined) ?? []
  const skillNames = skillsRaw.map((s) => s.skill_name)
  const reqText = (raw.requirements as string | undefined) ?? ''
  const requirements = reqText
    ? reqText.split('\n').filter(Boolean)
    : skillsRaw.filter((s) => s.requirement_type === 'required').map((s) => s.skill_name)

  const stipendMin = raw.stipend_min as number | undefined
  const stipendMax = raw.stipend_max as number | undefined
  const weeks = raw.duration_weeks as number | undefined

  return {
    id: String(raw.id),
    companyId: String(raw.company_id ?? ''),
    companyName: (raw.company_name as string) ?? 'Company',
    title: (raw.title as string) ?? '',
    description: (raw.description as string) ?? '',
    requirements,
    responsibilities: [],
    skills: skillNames,
    location: (raw.location as string) ?? '—',
    type: mapWorkModeToType((raw.work_mode as string) ?? 'onsite'),
    experienceLevel: 'intermediate',
    stipend: stipendMax ?? stipendMin,
    stipendCurrency: 'USD',
    duration: weeks ? `${weeks} weeks` : '—',
    openings: (raw.openings as number) ?? 1,
    applicationDeadline: toIso(raw.application_deadline as string),
    startDate: raw.start_date ? toIso(raw.start_date as string) : undefined,
    status: mapInternshipStatus((raw.status as string) ?? 'draft'),
    isVerified: Boolean(raw.is_featured),
    applicationCount: 0,
    createdAt: toIso(raw.created_at as string),
    updatedAt: toIso(raw.created_at as string),
    ...extras,
  }
}

export function mapInternshipListToPaginated(items: Record<string, unknown>[]): PaginatedResponse<Internship> {
  const data = items.map((i) => mapInternship(i))
  return { data, total: data.length, page: 1, pageSize: data.length, totalPages: 1 }
}

export function buildCreateInternshipPayload(data: {
  title: string
  description: string
  location: string
  type: InternshipType
  duration: string
  openings: number
  applicationDeadline: string
  startDate?: string
  stipend?: number
  skills: string[]
  requirements: string[]
  responsibilities: string[]
}) {
  return {
    title: data.title,
    description: data.description,
    location: data.location,
    work_mode: mapTypeToWorkMode(data.type),
    duration_weeks: parseDurationWeeks(data.duration),
    openings: data.openings,
    application_deadline: data.applicationDeadline,
    start_date: data.startDate || null,
    stipend_min: data.stipend ?? null,
    stipend_max: data.stipend ?? null,
    requirements: [...data.requirements, ...data.responsibilities].join('\n'),
    skills: data.skills.map((skill_name) => ({ skill_name, requirement_type: 'required' })),
  }
}

// ─── Application ───────────────────────────────────────────────────────────────

export function mapApplication(raw: Record<string, unknown>): Application {
  return {
    id: String(raw.id),
    internshipId: String(raw.internship_id ?? ''),
    internshipTitle: (raw.internship_title as string) ?? '',
    companyId: '',
    companyName: (raw.company_name as string) ?? '',
    studentId: String(raw.student_id ?? ''),
    studentName: (raw.student_name as string) ?? '',
    studentEmail: '',
    resumeId: '',
    coverLetter: (raw.cover_letter as string) ?? undefined,
    status: mapApplicationStatus((raw.status as string) ?? 'submitted'),
    appliedAt: toIso(raw.created_at as string),
    updatedAt: toIso(raw.updated_at as string ?? raw.created_at),
    matchScore: raw.match_score as number | undefined,
    notes: (raw.notes as string) ?? undefined,
  }
}

// ─── User profiles ─────────────────────────────────────────────────────────────

export async function mapStudentProfile(
  profile: Record<string, unknown>,
  email: string,
  skills: string[] = []
): Promise<StudentUser> {
  return {
    id: String(profile.user_id ?? profile.id),
    email,
    role: 'student',
    createdAt: toIso(profile.created_at as string),
    firstName: (profile.first_name as string) ?? '',
    lastName: (profile.last_name as string) ?? '',
    university: (profile.university as string) ?? undefined,
    major: (profile.major as string) ?? undefined,
    graduationYear: (profile.graduation_year as number) ?? undefined,
    gpa: (profile.gpa as number) ?? undefined,
    bio: (profile.bio as string) ?? undefined,
    linkedinUrl: (profile.linkedin_url as string) ?? undefined,
    githubUrl: (profile.github_url as string) ?? undefined,
    portfolioUrl: (profile.portfolio_url as string) ?? undefined,
    phoneNumber: (profile.phone as string) ?? undefined,
    location: (profile.location as string) ?? undefined,
    profilePicture: (profile.avatar_url as string) ?? undefined,
    skills,
    profileCompleteness: (profile.profile_completeness as number) ?? 0,
  }
}

export function mapCompanyProfile(profile: Record<string, unknown>, email: string): CompanyUser {
  return {
    id: String(profile.user_id ?? profile.id),
    email,
    role: 'company',
    createdAt: toIso(profile.created_at as string),
    companyName: (profile.company_name as string) ?? '',
    industry: (profile.industry as string) ?? '',
    size: 'medium',
    website: (profile.website as string) ?? undefined,
    description: (profile.description as string) ?? undefined,
    location: (profile.location as string) ?? '',
    isVerified: (profile.verification_status as string) === 'verified',
    contactPersonName: (profile.contact_name as string) ?? '',
    contactPersonTitle: undefined,
    logo: (profile.logo_url as string) ?? undefined,
  }
}

export function mapAdminUser(me: Record<string, unknown>): AdminUser {
  return {
    id: String(me.id),
    email: (me.email as string) ?? '',
    role: 'admin',
    createdAt: new Date().toISOString(),
    name: 'Administrator',
    permissions: ['*'],
  }
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export function mapStudentStats(raw: Record<string, unknown>): StudentStats {
  return {
    activeApplications: (raw.active_applications as number) ?? 0,
    savedInternships: 0,
    profileCompleteness: (raw.profile_completeness as number) ?? 0,
    averageMatchScore: 0,
    totalApplications: (raw.total_applications as number) ?? 0,
    interviewsScheduled: 0,
  }
}

export function mapCompanyStats(raw: Record<string, unknown>): CompanyStats {
  return {
    activeInternships: (raw.published_internships as number) ?? 0,
    totalApplications: (raw.total_applications as number) ?? 0,
    shortlistedCandidates: (raw.shortlisted_candidates as number) ?? 0,
    offersExtended: 0,
    acceptanceRate: 0,
    averageTimeToHire: 0,
  }
}

export function mapAdminStats(raw: Record<string, unknown>): AdminStats {
  return {
    totalStudents: (raw.total_students as number) ?? 0,
    totalCompanies: (raw.total_companies as number) ?? 0,
    totalInternships: (raw.total_internships as number) ?? 0,
    totalApplications: (raw.total_applications as number) ?? 0,
    pendingVerifications: (raw.pending_company_verifications as number) ?? 0,
    activeUsers: (raw.total_users as number) ?? 0,
    monthlyGrowth: 0,
  }
}

// ─── Resume ────────────────────────────────────────────────────────────────────

export function mapResume(raw: Record<string, unknown>): Resume {
  return {
    id: String(raw.id),
    studentId: '',
    fileName: (raw.original_filename as string) ?? (raw.filename as string) ?? 'resume.pdf',
    fileUrl: `/uploads/${raw.filename ?? ''}`,
    fileSize: (raw.file_size as number) ?? 0,
    uploadedAt: toIso(raw.created_at as string),
    isDefault: Boolean(raw.is_primary),
    analysisScore: undefined,
  }
}

export function mapResumeAnalysis(raw: Record<string, unknown>): ResumeAnalysisData {
  const score = (raw.overall_score as number) ?? 0
  const suggestions = (raw.improvement_suggestions as string[]) ?? (raw.feedback as string[]) ?? []
  const keywords = (raw.extracted_skills as string[]) ?? []
  const missing = (raw.missing_keywords as string[]) ?? []
  const emptySection = { score: 0, feedback: [] as string[] }
  return {
    overallScore: score,
    sections: {
      contact: emptySection,
      summary: emptySection,
      experience: emptySection,
      education: emptySection,
      skills: { score, feedback: suggestions.slice(0, 3) },
    },
    keywords,
    missingKeywords: missing,
    suggestions,
    atsCompatibility: score,
    readabilityScore: score,
  }
}

// ─── Career ────────────────────────────────────────────────────────────────────

export function mapSkillGapsFromAnalysis(raw: Record<string, unknown>): SkillGap[] {
  const missingRequired = (raw.missing_required as { skill: string; category: string; next_steps: string[] }[]) ?? []
  const missingPreferred = (raw.missing_preferred as { skill: string; category: string; next_steps: string[] }[]) ?? []

  const toGap = (item: { skill: string; category: string; next_steps: string[] }, importance: 'high' | 'medium' | 'low'): SkillGap => ({
    skill: item.skill,
    category: item.category,
    importance,
    requiredLevel: 'intermediate',
    resources: (item.next_steps ?? []).slice(0, 3).map((title) => ({
      title,
      url: '#',
      type: 'article' as const,
      isFree: true,
    })),
  })

  return [
    ...missingRequired.map((i) => toGap(i, 'high')),
    ...missingPreferred.map((i) => toGap(i, 'medium')),
  ]
}

export function mapRoadmapMilestones(roadmap: Record<string, unknown> | null): CareerRoadmapItem[] {
  if (!roadmap) return []
  const milestones = (roadmap.milestones as Record<string, unknown>[]) ?? []
  return milestones.map((m, idx) => ({
    id: String(m.id),
    title: (m.title as string) ?? `Milestone ${idx + 1}`,
    description: (m.description as string) ?? '',
    category: 'skill',
    priority: idx < 2 ? 'high' : 'medium',
    timeframe: m.duration_weeks ? `${m.duration_weeks} weeks` : '—',
    isCompleted: (m.status as string) === 'completed',
    resources: ((m.resources as string[]) ?? []).slice(0, 3).map((title) => ({
      title,
      url: '#',
      type: 'article' as const,
      isFree: true,
    })),
  }))
}

export function mapRecommendations(raw: Record<string, unknown>[]): CareerRecommendation[] {
  return raw.map((r) => ({
    title: (r.recommended_role as string) ?? '',
    matchPercentage: (r.match_percentage as number) ?? 0,
    description: (r.reasoning as string) ?? '',
    requiredSkills: (r.skills_to_acquire as string[]) ?? [],
    growthOutlook: 'Strong demand',
    companiesHiring: 0,
  }))
}

// ─── Notifications ─────────────────────────────────────────────────────────────

export function mapNotification(raw: Record<string, unknown>): Notification {
  return {
    id: String(raw.id),
    userId: '',
    type: 'system',
    title: (raw.title as string) ?? '',
    message: (raw.message as string) ?? '',
    isRead: Boolean(raw.is_read),
    createdAt: toIso(raw.created_at as string),
    link: (raw.link as string) ?? undefined,
  }
}

export type { AnyUser }
