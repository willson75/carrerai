// ─── User & Auth ───────────────────────────────────────────────────────────────

export type UserRole = 'student' | 'company' | 'admin'

export interface User {
  id: string
  email: string
  role: UserRole
  createdAt: string
}

export interface StudentUser extends User {
  role: 'student'
  firstName: string
  lastName: string
  profilePicture?: string
  university?: string
  major?: string
  graduationYear?: number
  gpa?: number
  skills: string[]
  bio?: string
  linkedinUrl?: string
  githubUrl?: string
  portfolioUrl?: string
  phoneNumber?: string
  location?: string
  profileCompleteness: number
}

export interface CompanyUser extends User {
  role: 'company'
  companyName: string
  logo?: string
  industry: string
  size: CompanySize
  website?: string
  description?: string
  location: string
  isVerified: boolean
  contactPersonName: string
  contactPersonTitle?: string
}

export interface AdminUser extends User {
  role: 'admin'
  name: string
  permissions: string[]
}

export type AnyUser = StudentUser | CompanyUser | AdminUser

/** Lightweight row from admin user list (no full profile fields). */
export interface AdminUserListItem {
  id: string
  email: string
  role: UserRole
  createdAt: string
  isActive: boolean
}

/** Company pending verification from admin API. */
export interface PendingCompanyVerification {
  id: string
  email: string
  companyName: string
  industry: string
  size: CompanySize | string
  website?: string
  location: string
  createdAt: string
  isVerified: false
  role: 'company'
  contactPersonName: string
}

export interface CompanyCandidateProfile {
  id: string
  firstName: string
  lastName: string
  email?: string
  university?: string
  major?: string
  graduationYear?: number
  location?: string
  bio?: string
  profileCompleteness: number
  skills: string[]
  matchScore?: number
  applicationStatus?: string
}

export type CompanySize = 'startup' | 'small' | 'medium' | 'large' | 'enterprise'

export interface AuthResponse {
  user: AnyUser
  token: string
  refreshToken: string
}

export interface LoginCredentials {
  email: string
  password: string
  role?: UserRole
}

export interface StudentRegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  university: string
  major: string
  graduationYear: number
}

export interface CompanyRegisterData {
  companyName: string
  email: string
  password: string
  confirmPassword: string
  industry: string
  size: CompanySize
  location: string
  contactPersonName: string
  website?: string
}

// ─── Internship ───────────────────────────────────────────────────────────────

export type InternshipType = 'full-time' | 'part-time' | 'remote' | 'hybrid' | 'on-site'
export type InternshipStatus = 'draft' | 'active' | 'closed' | 'paused'
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced'

export interface Internship {
  id: string
  companyId: string
  companyName: string
  companyLogo?: string
  title: string
  description: string
  requirements: string[]
  responsibilities: string[]
  skills: string[]
  location: string
  type: InternshipType
  experienceLevel: ExperienceLevel
  stipend?: number
  stipendCurrency?: string
  duration: string
  openings: number
  applicationDeadline: string
  startDate?: string
  status: InternshipStatus
  isVerified: boolean
  applicationCount: number
  createdAt: string
  updatedAt: string
  isSaved?: boolean
  matchScore?: number
}

export interface CreateInternshipData {
  title: string
  description: string
  requirements: string[]
  responsibilities: string[]
  skills: string[]
  location: string
  type: InternshipType
  experienceLevel: ExperienceLevel
  stipend?: number
  stipendCurrency?: string
  duration: string
  openings: number
  applicationDeadline: string
  startDate?: string
}

// ─── Application ──────────────────────────────────────────────────────────────

export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'shortlisted'
  | 'interview_scheduled'
  | 'offer_extended'
  | 'accepted'
  | 'rejected'
  | 'withdrawn'

export interface Application {
  id: string
  internshipId: string
  internshipTitle: string
  companyId: string
  companyName: string
  companyLogo?: string
  studentId: string
  studentName: string
  studentEmail: string
  resumeId: string
  coverLetter?: string
  status: ApplicationStatus
  appliedAt: string
  updatedAt: string
  matchScore?: number
  notes?: string
  interviewDate?: string
}

export interface ApplyData {
  internshipId: string
  resumeId: string
  coverLetter?: string
}

// ─── Resume ───────────────────────────────────────────────────────────────────

export interface Resume {
  id: string
  studentId: string
  fileName: string
  fileUrl: string
  fileSize: number
  uploadedAt: string
  isDefault: boolean
  analysisScore?: number
  analysisData?: ResumeAnalysisData
}

export interface ResumeAnalysisData {
  overallScore: number
  sections: {
    contact: SectionScore
    summary: SectionScore
    experience: SectionScore
    education: SectionScore
    skills: SectionScore
  }
  keywords: string[]
  missingKeywords: string[]
  suggestions: string[]
  atsCompatibility: number
  readabilityScore: number
}

export interface SectionScore {
  score: number
  feedback: string[]
}

// ─── Skills & Career ──────────────────────────────────────────────────────────

export interface Skill {
  id: string
  name: string
  category: string
  proficiency?: SkillProficiency
}

export type SkillProficiency = 'beginner' | 'intermediate' | 'advanced' | 'expert'

export interface SkillGap {
  skill: string
  category: string
  importance: 'high' | 'medium' | 'low'
  currentLevel?: SkillProficiency
  requiredLevel: SkillProficiency
  resources: LearningResource[]
}

export interface LearningResource {
  title: string
  url: string
  type: 'course' | 'article' | 'video' | 'book' | 'project'
  platform?: string
  duration?: string
  isFree: boolean
}

export interface CareerRoadmapItem {
  id: string
  title: string
  description: string
  category: 'skill' | 'certification' | 'project' | 'experience' | 'education'
  priority: 'high' | 'medium' | 'low'
  timeframe: string
  isCompleted: boolean
  resources?: LearningResource[]
}

export interface CareerRecommendation {
  title: string
  matchPercentage: number
  description: string
  requiredSkills: string[]
  averageSalary?: string
  growthOutlook: string
  companiesHiring: number
}

// ─── Notifications ────────────────────────────────────────────────────────────

export type NotificationType =
  | 'application_update'
  | 'new_match'
  | 'interview_reminder'
  | 'deadline_reminder'
  | 'system'
  | 'company_verification'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  createdAt: string
  link?: string
  metadata?: Record<string, unknown>
}

// ─── Analytics & Stats ────────────────────────────────────────────────────────

export interface StudentStats {
  activeApplications: number
  savedInternships: number
  profileCompleteness: number
  averageMatchScore: number
  totalApplications: number
  interviewsScheduled: number
}

export interface CompanyStats {
  activeInternships: number
  totalApplications: number
  shortlistedCandidates: number
  offersExtended: number
  acceptanceRate: number
  averageTimeToHire: number
}

export interface AdminStats {
  totalStudents: number
  totalCompanies: number
  totalInternships: number
  totalApplications: number
  pendingVerifications: number
  activeUsers: number
  monthlyGrowth: number
}

// ─── Pagination & Filters ─────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface InternshipFilters {
  search?: string
  type?: InternshipType[]
  location?: string
  skills?: string[]
  experienceLevel?: ExperienceLevel[]
  minStipend?: number
  maxStipend?: number
  page?: number
  pageSize?: number
  sortBy?: 'relevance' | 'date' | 'stipend' | 'deadline'
}

export interface ApplicationFilters {
  status?: ApplicationStatus[]
  page?: number
  pageSize?: number
}

// ─── API Error ────────────────────────────────────────────────────────────────

export interface ApiError {
  message: string
  code?: string
  details?: Record<string, string[]>
}

// ─── Select Option ────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}
