import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type {
  AuthResponse,
  LoginCredentials,
  StudentRegisterData,
  CompanyRegisterData,
  Internship,
  CreateInternshipData,
  Application,
  ApplyData,
  Resume,
  ResumeAnalysisData,
  Notification,
  StudentStats,
  CompanyStats,
  AdminStats,
  PaginatedResponse,
  InternshipFilters,
  ApplicationFilters,
  SkillGap,
  CareerRoadmapItem,
  CareerRecommendation,
  AnyUser,
} from '@/types'
import {
  mapInternship,
  mapInternshipListToPaginated,
  buildCreateInternshipPayload,
  mapApplication,
  mapStudentProfile,
  mapCompanyProfile,
  mapAdminUser,
  mapStudentStats,
  mapCompanyStats,
  mapAdminStats,
  mapResume,
  mapResumeAnalysis,
  mapSkillGapsFromAnalysis,
  mapRoadmapMilestones,
  mapRecommendations,
  mapNotification,
} from '@/lib/mappers'

const API_PREFIX = '/api/v1'
const API_BASE_URL = import.meta.env.VITE_API_URL
const API_URL = API_BASE_URL
  ? `${API_BASE_URL.replace(/\/+$/, '')}${API_PREFIX}`
  : API_PREFIX

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
})

const TOKEN_KEY = 'cb_access_token'
const REFRESH_KEY = 'cb_refresh_token'

let authToken: string | null = null

export function setAuthToken(token: string | null) {
  authToken = token
  if (token) sessionStorage.setItem(TOKEN_KEY, token)
  else sessionStorage.removeItem(TOKEN_KEY)
}

export function getAuthToken(): string | null {
  return authToken ?? sessionStorage.getItem(TOKEN_KEY)
}

function getRefreshToken(): string | null {
  return sessionStorage.getItem(REFRESH_KEY)
}

function storeTokens(access: string, refresh: string) {
  setAuthToken(access)
  sessionStorage.setItem(REFRESH_KEY, refresh)
}

function clearTokens() {
  setAuthToken(null)
  sessionStorage.removeItem(REFRESH_KEY)
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAuthToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearTokens()
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }
    return Promise.reject(error)
  }
)

// ─── Auth helpers ─────────────────────────────────────────────────────────────

interface TokenPayload {
  access_token: string
  refresh_token: string
  role: string
}

async function loginWithPassword(email: string, password: string): Promise<TokenPayload> {
  const body = new URLSearchParams()
  body.set('username', email)
  body.set('password', password)
  const { data } = await api.post<TokenPayload>('/auth/login', body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return data
}

async function fetchUserForRole(role: string, email: string): Promise<AnyUser> {
  if (role === 'student') {
    const [{ data: profile }, { data: skills }] = await Promise.all([
      api.get<Record<string, unknown>>('/students/profile'),
      api.get<{ skill_name: string }[]>('/students/skills'),
    ])
    return mapStudentProfile(
      profile,
      email,
      skills.map((s) => s.skill_name)
    )
  }
  if (role === 'company') {
    const { data: profile } = await api.get<Record<string, unknown>>('/company/profile')
    return mapCompanyProfile(profile, email)
  }
  const { data: me } = await api.get<Record<string, unknown>>('/auth/me')
  return mapAdminUser(me)
}

async function completeAuth(tokens: TokenPayload): Promise<AuthResponse> {
  storeTokens(tokens.access_token, tokens.refresh_token)
  const { data: me } = await api.get<{ email: string; role: string }>('/auth/me')
  const user = await fetchUserForRole(tokens.role || me.role, me.email)
  return { user, token: tokens.access_token, refreshToken: tokens.refresh_token }
}

// ─── Auth endpoints ───────────────────────────────────────────────────────────

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const tokens = await loginWithPassword(credentials.email, credentials.password)
    return completeAuth(tokens)
  },

  loginAdmin: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data: tokens } = await api.post<TokenPayload>('/admin/auth/login', credentials)
    return completeAuth(tokens)
  },

  registerStudent: async (data: StudentRegisterData): Promise<AuthResponse> => {
    const { data: tokens } = await api.post<TokenPayload>('/auth/register', {
      email: data.email,
      password: data.password,
      role: 'student',
      first_name: data.firstName,
      last_name: data.lastName,
    })
    const auth = await completeAuth(tokens)
    await api.put('/students/profile', {
      university: data.university,
      major: data.major,
      graduation_year: data.graduationYear,
    })
    auth.user = await fetchUserForRole('student', data.email)
    return auth
  },

  registerCompany: async (data: CompanyRegisterData): Promise<AuthResponse> => {
    const { data: tokens } = await api.post<TokenPayload>('/auth/register', {
      email: data.email,
      password: data.password,
      role: 'company',
      company_name: data.companyName,
      first_name: data.contactPersonName,
    })
    const auth = await completeAuth(tokens)
    await api.put('/company/profile', {
      industry: data.industry,
      company_size: data.size,
      location: data.location,
      website: data.website,
      contact_name: data.contactPersonName,
    })
    auth.user = await fetchUserForRole('company', data.email)
    return auth
  },

  logout: async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      clearTokens()
    }
  },

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }).then((r) => r.data),

  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, new_password: password }).then((r) => r.data),

  getMe: async (): Promise<AnyUser> => {
    const token = getAuthToken()
    if (!token) throw new Error('Not authenticated')
    const { data: me } = await api.get<{ email: string; role: string }>('/auth/me')
    return fetchUserForRole(me.role, me.email)
  },

  restoreSession: async (): Promise<AuthResponse | null> => {
    const access = sessionStorage.getItem(TOKEN_KEY)
    const refresh = getRefreshToken()
    if (!access) return null
    setAuthToken(access)
    try {
      const user = await authApi.getMe()
      return { user, token: access, refreshToken: refresh ?? '' }
    } catch {
      if (refresh) {
        try {
          const { data: tokens } = await api.post<TokenPayload>('/auth/refresh', {
            refresh_token: refresh,
          })
          return completeAuth(tokens)
        } catch {
          clearTokens()
        }
      }
      clearTokens()
      return null
    }
  },
}

// ─── Student endpoints ────────────────────────────────────────────────────────

export const studentApi = {
  getStats: async (): Promise<StudentStats> => {
    const { data } = await api.get<Record<string, unknown>>('/students/dashboard')
    const stats = mapStudentStats(data)
    try {
      const saved = await api.get<unknown[]>('/internships/saved')
      stats.savedInternships = saved.data.length
    } catch {
      /* ignore */
    }
    return stats
  },

  getProfile: async (): Promise<AnyUser> => {
    const { data: me } = await api.get<{ email: string }>('/auth/me')
    const { data: profile } = await api.get<Record<string, unknown>>('/students/profile')
    const { data: skills } = await api.get<{ skill_name: string }[]>('/students/skills')
    return mapStudentProfile(
      profile,
      me.email,
      skills.map((s) => s.skill_name)
    )
  },

  updateProfile: async (data: Partial<AnyUser>): Promise<AnyUser> => {
    const payload: Record<string, unknown> = {}
    const u = data as Record<string, unknown>
    if (u.firstName !== undefined) payload.first_name = u.firstName
    if (u.lastName !== undefined) payload.last_name = u.lastName
    if (u.phoneNumber !== undefined) payload.phone = u.phoneNumber
    if (u.bio !== undefined) payload.bio = u.bio
    if (u.university !== undefined) payload.university = u.university
    if (u.major !== undefined) payload.major = u.major
    if (u.graduationYear !== undefined) payload.graduation_year = u.graduationYear
    if (u.gpa !== undefined) payload.gpa = u.gpa
    if (u.location !== undefined) payload.location = u.location
    if (u.linkedinUrl !== undefined) payload.linkedin_url = u.linkedinUrl
    if (u.githubUrl !== undefined) payload.github_url = u.githubUrl
    if (u.portfolioUrl !== undefined) payload.portfolio_url = u.portfolioUrl

    await api.put('/students/profile', payload)

    const skillsStr = u.skills as string | string[] | undefined
    if (skillsStr) {
      const names = Array.isArray(skillsStr)
        ? skillsStr
        : skillsStr.split(',').map((s) => s.trim()).filter(Boolean)
      const { data: existing } = await api.get<{ id: number; skill_name: string }[]>('/students/skills')
      for (const skill of names) {
        if (!existing.some((e) => e.skill_name.toLowerCase() === skill.toLowerCase())) {
          await api.post('/students/skills', { skill_name: skill })
        }
      }
    }

    return studentApi.getProfile()
  },

  uploadAvatar: (_file: File) => Promise.reject(new Error('Avatar upload not configured on API')),
}

// ─── Resume endpoints ─────────────────────────────────────────────────────────

export const resumeApi = {
  list: async (): Promise<Resume[]> => {
    const { data } = await api.get<Record<string, unknown>[]>('/resumes')
    return data.map(mapResume)
  },

  upload: async (file: File): Promise<Resume> => {
    const form = new FormData()
    form.append('file', file)
    const { data } = await api.post<Record<string, unknown>>('/resumes/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return mapResume(data)
  },

  delete: (id: string) => api.delete(`/resumes/${id}`),

  setDefault: (id: string) =>
    api.put<Record<string, unknown>>(`/resumes/${id}/primary`).then((r) => mapResume(r.data)),

  analyze: (id: string) =>
    api.post<Record<string, unknown>>(`/resumes/${id}/analyze`).then((r) => mapResumeAnalysis(r.data)),
}

// ─── Internship endpoints ─────────────────────────────────────────────────────

function mapListFilters(filters?: InternshipFilters) {
  return {
    title: filters?.search,
    work_mode: filters?.type?.[0] ? filters.type[0].replace('on-site', 'onsite').replace('-', '') : undefined,
    stipend_min: filters?.minStipend,
    skills: filters?.skills?.join(','),
    page: filters?.page ?? 1,
    size: filters?.pageSize ?? 20,
  }
}

export const internshipApi = {
  list: async (filters?: InternshipFilters): Promise<PaginatedResponse<Internship>> => {
    const { data } = await api.get<Record<string, unknown>[]>('/internships', {
      params: mapListFilters(filters),
    })
    return mapInternshipListToPaginated(data)
  },

  get: async (id: string): Promise<Internship> => {
    const { data } = await api.get<Record<string, unknown>>(`/internships/${id}`)
    let matchScore: number | undefined
    try {
      const match = await api.get<{ score: number }>(`/internships/${id}/match`)
      matchScore = match.data.score
    } catch {
      /* public or non-student */
    }
    return mapInternship(data, { matchScore })
  },

  create: async (data: CreateInternshipData) => {
    const payload = buildCreateInternshipPayload(data)
    const { data: created } = await api.post<Record<string, unknown>>('/company/internships', payload)
    const internship = mapInternship(created)
    await api.put(`/company/internships/${internship.id}/publish`)
    return internship
  },

  update: async (id: string, data: Partial<CreateInternshipData>) => {
    const payload = buildCreateInternshipPayload(data as CreateInternshipData)
    const { data: updated } = await api.put<Record<string, unknown>>(`/company/internships/${id}`, payload)
    return mapInternship(updated)
  },

  delete: (id: string) => api.delete(`/company/internships/${id}`),

  save: (id: string) => api.post(`/internships/${id}/save`),

  unsave: (id: string) => api.delete(`/internships/${id}/save`),

  getSaved: async (): Promise<Internship[]> => {
    const { data } = await api.get<Record<string, unknown>[]>('/internships/saved')
    return data.map((i) => mapInternship(i, { isSaved: true }))
  },

  getCompanyInternships: async (): Promise<Internship[]> => {
    const { data } = await api.get<Record<string, unknown>[]>('/company/internships')
    return data.map((i) => mapInternship(i))
  },

  getRecommended: async (): Promise<Internship[]> => {
    const { data } = await api.get<Record<string, unknown>[]>('/internships', { params: { size: 6, page: 1 } })
    return data.slice(0, 6).map((i) => mapInternship(i))
  },

  getMatch: (internshipId: string) =>
    api.get(`/internships/${internshipId}/match`).then((r) => r.data),
}

// ─── Application endpoints ────────────────────────────────────────────────────

export const applicationApi = {
  apply: async (data: ApplyData): Promise<Application> => {
    const { data: app } = await api.post<Record<string, unknown>>('/applications', {
      internship_id: Number(data.internshipId),
      resume_id: data.resumeId ? Number(data.resumeId) : undefined,
      cover_letter: data.coverLetter,
    })
    return mapApplication(app)
  },

  list: async (_filters?: ApplicationFilters): Promise<PaginatedResponse<Application>> => {
    const { data } = await api.get<Record<string, unknown>[]>('/applications')
    const mapped = data.map(mapApplication)
    return { data: mapped, total: mapped.length, page: 1, pageSize: mapped.length, totalPages: 1 }
  },

  get: async (id: string): Promise<Application> => {
    const { data } = await api.get<Record<string, unknown>>(`/applications/${id}`)
    return mapApplication(data)
  },

  withdraw: async (id: string): Promise<Application> => {
    const { data } = await api.put<Record<string, unknown>>(`/applications/${id}/withdraw`)
    return mapApplication(data)
  },

  getForInternship: async (
    internshipId: string,
    filters?: ApplicationFilters
  ): Promise<PaginatedResponse<Application>> => {
    const { data } = await api.get<Record<string, unknown>[]>(
      `/company/internships/${internshipId}/applications`
    )
    let mapped = data.map(mapApplication)
    if (filters?.status?.length) {
      mapped = mapped.filter((a) => filters.status!.includes(a.status))
    }
    return { data: mapped, total: mapped.length, page: 1, pageSize: mapped.length, totalPages: 1 }
  },

  listForCompany: async (filters?: ApplicationFilters): Promise<PaginatedResponse<Application>> => {
    const { data } = await api.get<Record<string, unknown>[]>('/company/applications')
    let mapped = data.map(mapApplication)
    if (filters?.status?.length) {
      mapped = mapped.filter((a) => filters.status!.includes(a.status))
    }
    return { data: mapped, total: mapped.length, page: 1, pageSize: mapped.length, totalPages: 1 }
  },

  updateStatus: (id: string, status: string, notes?: string) =>
    api
      .put<Record<string, unknown>>(`/company/applications/${id}/status`, { status, note: notes })
      .then((r) => mapApplication(r.data)),

  shortlist: (id: string) => applicationApi.updateStatus(id, 'shortlisted'),
}

// ─── Career / AI endpoints ────────────────────────────────────────────────────

export const careerApi = {
  getSkillGaps: async (internshipId?: string): Promise<SkillGap[]> => {
    let id = internshipId
    if (!id) {
      const { data } = await api.get<Record<string, unknown>[]>('/internships', { params: { size: 1, page: 1 } })
      if (!data.length) return []
      id = String(data[0].id)
    }
    const { data: gap } = await api.get<Record<string, unknown>>(`/career/skill-gap/${id}`)
    return mapSkillGapsFromAnalysis(gap)
  },

  getRoadmap: async (): Promise<CareerRoadmapItem[]> => {
    let { data: roadmap } = await api.get<Record<string, unknown> | null>('/career/roadmap')
    if (!roadmap) {
      const profile = (await studentApi.getProfile()) as { targetRole?: string }
      await api.post('/career/roadmap', {
        target_role: profile.targetRole ?? 'Software Engineer',
      })
      const res = await api.get<Record<string, unknown>>('/career/roadmap')
      roadmap = res.data
    }
    return mapRoadmapMilestones(roadmap)
  },

  updateRoadmapItem: async (id: string, isCompleted: boolean): Promise<CareerRoadmapItem> => {
    await api.put(`/career/roadmap/milestones/${id}`, {
      status: isCompleted ? 'completed' : 'pending',
    })
    const items = await careerApi.getRoadmap()
    return items.find((i) => i.id === id) ?? items[0]
  },

  getRecommendations: async (): Promise<CareerRecommendation[]> => {
    const { data } = await api.get<Record<string, unknown>[]>('/career/recommendations')
    return mapRecommendations(data)
  },
}

// ─── Company endpoints ────────────────────────────────────────────────────────

export const companyApi = {
  getStats: async (): Promise<CompanyStats> => {
    const { data } = await api.get<Record<string, unknown>>('/company/dashboard')
    return mapCompanyStats(data)
  },

  getProfile: async (): Promise<AnyUser> => {
    const { data: me } = await api.get<{ email: string }>('/auth/me')
    const { data: profile } = await api.get<Record<string, unknown>>('/company/profile')
    return mapCompanyProfile(profile, me.email)
  },

  updateProfile: async (data: Partial<AnyUser>): Promise<AnyUser> => {
    const u = data as Record<string, unknown>
    const payload: Record<string, unknown> = {}
    if (u.companyName !== undefined) payload.company_name = u.companyName
    if (u.industry !== undefined) payload.industry = u.industry
    if (u.size !== undefined) payload.company_size = u.size
    if (u.website !== undefined) payload.website = u.website
    if (u.description !== undefined) payload.description = u.description
    if (u.location !== undefined) payload.location = u.location
    if (u.contactPersonName !== undefined) payload.contact_name = u.contactPersonName
    await api.put('/company/profile', payload)
    return companyApi.getProfile()
  },

  getCandidates: async (internshipId: string) => {
    const { data } = await api.get<
      {
        application_id: number
        student_id: number
        student_name: string
        student_email?: string
        match_score: number
        status: string
      }[]
    >(`/company/internships/${internshipId}/candidates`)
    return data.map((c) => ({
      id: String(c.application_id),
      internshipId,
      studentId: String(c.student_id),
      studentName: c.student_name ?? '',
      studentEmail: c.student_email ?? '',
      matchScore: c.match_score,
      status: c.status,
    }))
  },

  getMatchedCandidates: (internshipId: string) => companyApi.getCandidates(internshipId),

  getStudentCandidate: async (studentId: string) => {
    const { data } = await api.get<Record<string, unknown>>(`/company/students/${studentId}`)
    return {
      id: String(data.id),
      firstName: String(data.first_name ?? ''),
      lastName: String(data.last_name ?? ''),
      email: data.email as string | undefined,
      university: data.university as string | undefined,
      major: data.major as string | undefined,
      graduationYear: data.graduation_year as number | undefined,
      location: data.location as string | undefined,
      bio: data.bio as string | undefined,
      profileCompleteness: Number(data.profile_completeness ?? 0),
      skills: (data.skills as string[]) ?? [],
      matchScore: data.match_score as number | undefined,
      applicationStatus: data.application_status as string | undefined,
    }
  },
}

// ─── Notification endpoints ───────────────────────────────────────────────────

export const notificationApi = {
  list: async (): Promise<Notification[]> => {
    const { data } = await api.get<Record<string, unknown>[]>('/notifications')
    return data.map(mapNotification)
  },

  markRead: (id: string) =>
    api.put<Record<string, unknown>>(`/notifications/${id}/read`).then((r) => mapNotification(r.data)),

  markAllRead: () => api.put('/notifications/read-all'),

  delete: (id: string) => api.delete(`/notifications/${id}`),
}

// ─── Admin endpoints ──────────────────────────────────────────────────────────

export const adminApi = {
  getStats: async (): Promise<AdminStats> => {
    const { data } = await api.get<Record<string, unknown>>('/admin/dashboard')
    return mapAdminStats(data)
  },

  getUsers: async (params?: { role?: string; page?: number; search?: string }) => {
    const { data } = await api.get<Record<string, unknown>[]>('/admin/users', {
      params: { page: params?.page ?? 1, size: 50 },
    })
    let users = data
    if (params?.role) users = users.filter((u) => u.role === params.role)
    if (params?.search) {
      const q = params.search.toLowerCase()
      users = users.filter((u) => String(u.email).toLowerCase().includes(q))
    }
    const mapped = users.map((u) => ({
      id: String(u.id),
      email: String(u.email),
      role: u.role as 'student' | 'company' | 'admin',
      createdAt: String(u.created_at ?? ''),
      isActive: u.is_active !== false,
    }))
    return {
      data: mapped,
      total: mapped.length,
      page: 1,
      pageSize: mapped.length,
      totalPages: 1,
    }
  },

  banUser: (id: string) =>
    api.put(`/admin/users/${id}/toggle-active`).then((r) => r.data),

  activateUser: (id: string) =>
    api.put(`/admin/users/${id}/toggle-active`).then((r) => r.data),

  getPendingVerifications: async () => {
    const { data } = await api.get<
      {
        id: number
        email?: string
        company_name: string
        industry?: string
        company_size?: string
        website?: string
        location?: string
        verification_status: string
        created_at?: string
      }[]
    >('/admin/companies')
    return data
      .filter((c) => c.verification_status === 'pending')
      .map((c) => ({
        id: String(c.id),
        email: c.email ?? '',
        companyName: c.company_name,
        industry: c.industry ?? '—',
        size: (c.company_size ?? 'medium') as import('@/types').CompanySize,
        website: c.website,
        location: c.location ?? '—',
        createdAt: c.created_at ?? new Date().toISOString(),
        isVerified: false as const,
        role: 'company' as const,
        contactPersonName: '—',
      }))
  },

  verifyCompany: (id: string) => api.put(`/admin/companies/${id}/verify`),

  rejectCompany: (id: string, _reason: string) => api.put(`/admin/companies/${id}/reject`),

  getPendingInternships: async (params?: { page?: number }) => {
    const { data } = await api.get<Record<string, unknown>[]>('/admin/internships', {
      params: { page: params?.page ?? 1, size: 50 },
    })
    const internships = data.map((i) => mapInternship(i))
    return { data: internships, total: internships.length, page: 1, pageSize: internships.length, totalPages: 1 }
  },

  approveInternship: (id: string) =>
    api.put(`/admin/internships/${id}/moderate`, { action: 'feature' }),

  rejectInternship: (id: string, _reason: string) =>
    api.put(`/admin/internships/${id}/moderate`, { action: 'close' }),

  getApplicationOverview: async () => {
    const { data } = await api.get<Record<string, unknown>[]>('/admin/applications')
    const mapped = data.map(mapApplication)
    return { data: mapped, total: mapped.length, page: 1, pageSize: mapped.length, totalPages: 1 }
  },

  getAnalytics: (period?: string) => api.get('/admin/analytics', { params: { period } }).then((r) => r.data),
}

export default api
