import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'

// Layouts
import { StudentLayout } from '@/components/layout/StudentLayout'
import { CompanyLayout } from '@/components/layout/CompanyLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'

// Public pages
import { Landing } from '@/pages/Landing'
import { About } from '@/pages/About'
import { Contact } from '@/pages/Contact'
import { NotFound } from '@/pages/NotFound'
import { AccessDenied } from '@/pages/AccessDenied'

// Auth pages
import { Login } from '@/pages/auth/Login'
import { StudentRegister } from '@/pages/auth/StudentRegister'
import { CompanyRegister } from '@/pages/auth/CompanyRegister'
import { ForgotPassword } from '@/pages/auth/ForgotPassword'
import { ResetPassword } from '@/pages/auth/ResetPassword'

// Student pages
import { StudentDashboard } from '@/pages/student/Dashboard'
import { StudentProfile } from '@/pages/student/Profile'
import { ResumeManagement } from '@/pages/student/ResumeManagement'
import { ResumeAnalysis } from '@/pages/student/ResumeAnalysis'
import { InternshipMarketplace } from '@/pages/student/InternshipMarketplace'
import { InternshipDetails } from '@/pages/student/InternshipDetails'
import { SkillGapAnalysis } from '@/pages/student/SkillGapAnalysis'
import { CareerRoadmap } from '@/pages/student/CareerRoadmap'
import { CareerRecommendations } from '@/pages/student/CareerRecommendations'
import { MyApplications } from '@/pages/student/MyApplications'
import { ApplicationDetails } from '@/pages/student/ApplicationDetails'
import { SavedInternships } from '@/pages/student/SavedInternships'
import { Notifications as StudentNotifications } from '@/pages/student/Notifications'
import { StudentSettings } from '@/pages/student/Settings'

// Company pages
import { CompanyDashboard } from '@/pages/company/Dashboard'
import { CompanyProfile } from '@/pages/company/Profile'
import { ManageInternships } from '@/pages/company/ManageInternships'
import { CreateInternship } from '@/pages/company/CreateInternship'
import { EditInternship } from '@/pages/company/EditInternship'
import { ApplicantManagement } from '@/pages/company/ApplicantManagement'
import { CandidateProfile } from '@/pages/company/CandidateProfile'
import { CandidateMatching } from '@/pages/company/CandidateMatching'
import { ShortlistManagement } from '@/pages/company/ShortlistManagement'
import { CompanyNotifications } from '@/pages/company/Notifications'
import { CompanySettings } from '@/pages/company/Settings'

// Admin pages
import { AdminLogin } from '@/pages/admin/Login'
import { AdminDashboard } from '@/pages/admin/Dashboard'
import { UserManagement } from '@/pages/admin/UserManagement'
import { CompanyVerification } from '@/pages/admin/CompanyVerification'
import { InternshipModeration } from '@/pages/admin/InternshipModeration'
import { ApplicationOverview } from '@/pages/admin/ApplicationOverview'
import { Analytics } from '@/pages/admin/Analytics'
import { AdminSettings } from '@/pages/admin/Settings'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ── Public ── */}
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/student" element={<StudentRegister />} />
        <Route path="/register/company" element={<CompanyRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/access-denied" element={<AccessDenied />} />

        {/* ── Student portal ── */}
        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="resumes" element={<ResumeManagement />} />
          <Route path="resume-analysis" element={<ResumeAnalysis />} />
          <Route path="internships" element={<InternshipMarketplace />} />
          <Route path="internships/:id" element={<InternshipDetails />} />
          <Route path="skill-gap" element={<SkillGapAnalysis />} />
          <Route path="roadmap" element={<CareerRoadmap />} />
          <Route path="recommendations" element={<CareerRecommendations />} />
          <Route path="applications" element={<MyApplications />} />
          <Route path="applications/:id" element={<ApplicationDetails />} />
          <Route path="saved" element={<SavedInternships />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="settings" element={<StudentSettings />} />
        </Route>

        {/* ── Company portal ── */}
        <Route
          path="/company"
          element={
            <ProtectedRoute role="company">
              <CompanyLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CompanyDashboard />} />
          <Route path="profile" element={<CompanyProfile />} />
          <Route path="internships" element={<ManageInternships />} />
          <Route path="internships/create" element={<CreateInternship />} />
          <Route path="internships/:id/edit" element={<EditInternship />} />
          <Route path="applicants" element={<ApplicantManagement />} />
          <Route path="candidates/:studentId" element={<CandidateProfile />} />
          <Route path="matching" element={<CandidateMatching />} />
          <Route path="shortlist" element={<ShortlistManagement />} />
          <Route path="notifications" element={<CompanyNotifications />} />
          <Route path="settings" element={<CompanySettings />} />
        </Route>

        {/* ── Admin portal ── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="verifications" element={<CompanyVerification />} />
          <Route path="internships" element={<InternshipModeration />} />
          <Route path="applications" element={<ApplicationOverview />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* ── 404 ── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
