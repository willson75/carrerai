import React from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  Brain,
  BarChart2,
  Map,
  Building2,
  SendHorizonal,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  TrendingUp,
  Sparkles,
  LayoutDashboard,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'

const features = [
  {
    icon: Brain,
    title: 'Explainable matching',
    description:
      'Rule-based skill scoring shows matched skills, gaps, and a transparent breakdown — not a black box.',
    accent: 'from-brand-500/20 to-brand-600/5 text-brand-700',
  },
  {
    icon: BarChart2,
    title: 'Resume analysis',
    description:
      'Upload a PDF, extract skills and sections, and get actionable suggestions to improve completeness.',
    accent: 'from-accent-500/20 to-accent-600/5 text-accent-600',
  },
  {
    icon: Map,
    title: 'Skill gap & roadmap',
    description:
      'Compare your profile to internship requirements and follow phased milestones toward your target role.',
    accent: 'from-secondary-500/20 to-secondary-600/5 text-secondary-700',
  },
  {
    icon: TrendingUp,
    title: 'Career recommendations',
    description:
      'Discover roles and listings ranked by your skills, projects, and preferences — with clear reasons why.',
    accent: 'from-brand-400/20 to-brand-500/5 text-brand-600',
  },
  {
    icon: Building2,
    title: 'Recruiter workspace',
    description:
      'Publish internships, review applicants, shortlist candidates, and track pipeline status in one place.',
    accent: 'from-slate-500/15 to-slate-600/5 text-slate-700',
  },
  {
    icon: SendHorizonal,
    title: 'Application tracking',
    description:
      'Apply once, track status history, save opportunities, and stay on top of deadlines from your dashboard.',
    accent: 'from-accent-400/15 to-brand-500/5 text-brand-700',
  },
]

const steps = [
  { step: '01', title: 'Build your profile', description: 'Skills, education, and links — everything recruiters need in one place.' },
  { step: '02', title: 'Analyze your resume', description: 'PDF upload with skill extraction and improvement tips.' },
  { step: '03', title: 'Find the right fit', description: 'Search, filter, and review explainable match scores per listing.' },
  { step: '04', title: 'Apply with confidence', description: 'Track applications and follow your personalized career roadmap.' },
]

const platformHighlights = [
  'JWT auth with student, company, and admin roles',
  'PostgreSQL persistence with Alembic migrations',
  'Deterministic AI features — no API keys required for demos',
]

export function Landing() {
  return (
    <div className="min-h-screen bg-surface-light">
      <Navbar variant="transparent" />

      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-950 text-white pt-24 pb-28 lg:pb-36">
        <div className="absolute inset-0 bg-hero-mesh pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(30,27,75,0.95))] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-accent-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-white/10 backdrop-blur-sm">
                <Sparkles className="w-4 h-4" />
                CareerBridge AI
              </div>
              <p className="text-accent-400 font-medium text-sm tracking-wide uppercase mb-3">
                Discover. Prepare. Apply. Get Hired.
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
                Your internship journey,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-brand-300">
                  engineered for clarity
                </span>
              </h1>
              <p className="text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
                A full-stack career platform for students and recruiters — matching, resume insights,
                skill gaps, and roadmaps you can explain in an interview.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link to="/register/student">
                  <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Start as a student
                  </Button>
                </Link>
                <Link to="/register/company">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/15"
                    leftIcon={<Building2 className="w-5 h-5" />}
                  >
                    Post internships
                  </Button>
                </Link>
              </div>
              <ul className="mt-8 space-y-2">
                {platformHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                    <CheckCircle className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Floating dashboard preview */}
            <div className="relative hidden lg:block perspective-[1200px]">
              <div
                className="absolute -inset-4 bg-brand-500/20 rounded-3xl blur-2xl animate-float-slow"
                aria-hidden
              />
              <div className="relative animate-float-delayed transform lg:rotate-y-[-4deg] lg:rotate-x-[2deg]">
                <div className="card-elevated p-1 bg-white/95 backdrop-blur border-white/20 shadow-elevated-lg">
                  <div className="rounded-xl overflow-hidden bg-slate-50">
                    <div className="flex items-center gap-2 px-4 py-3 bg-brand-950 border-b border-white/10">
                      <LayoutDashboard className="w-4 h-4 text-accent-400" />
                      <span className="text-xs font-medium text-slate-300">Student dashboard</span>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: 'Applications', value: '4' },
                          { label: 'Avg match', value: '78%' },
                          { label: 'Saved', value: '6' },
                          { label: 'Profile', value: '85%' },
                        ].map(({ label, value }) => (
                          <div
                            key={label}
                            className="rounded-lg bg-white border border-slate-200/80 p-3 shadow-sm"
                          >
                            <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
                            <p className="text-lg font-bold text-brand-700">{value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="rounded-lg bg-white border border-slate-200 p-3">
                        <p className="text-xs font-semibold text-slate-800 mb-2">Recommended for you</p>
                        <div className="space-y-2">
                          {['Frontend Intern · 82% match', 'Data Analyst · 76% match'].map((row) => (
                            <div
                              key={row}
                              className="flex justify-between text-xs text-slate-600 py-1.5 border-b border-slate-100 last:border-0"
                            >
                              <span>{row.split(' · ')[0]}</span>
                              <span className="font-medium text-accent-600">{row.split(' · ')[1]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip — product capabilities, not fabricated metrics */}
      <section className="border-b border-slate-200 bg-white py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              { value: '3 roles', label: 'Student · Company · Admin' },
              { value: '40+ pages', label: 'End-to-end workflows' },
              { value: 'Explainable', label: 'Matching & career AI' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-bold text-brand-700 mb-1">{value}</p>
                <p className="text-slate-500 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Built for serious career prep
            </h2>
            <p className="text-lg text-slate-500">
              Every major workflow connects to a real FastAPI backend — profiles, uploads, applications,
              and moderation included.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description, accent }) => (
              <div
                key={title}
                className="card-elevated p-6 hover:shadow-elevated-lg transition-shadow duration-300 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${accent}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2 group-hover:text-brand-700 transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-surface-muted bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How it works</h2>
            <p className="text-lg text-slate-500">From profile to offer letter in four steps.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(({ step, title, description }) => (
              <div key={step} className="relative">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-bold text-lg flex items-center justify-center mb-4 shadow-glow">
                  {step}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <blockquote className="text-xl sm:text-2xl font-medium text-slate-800 mb-6 leading-relaxed">
            &ldquo;The match breakdown helped me understand exactly which skills to highlight — and which
            courses to take before applying.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold">
              A
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-900">Demo student persona</p>
              <p className="text-xs text-slate-500">Illustrative quote · seed data available</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-brand-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-950/40" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to explore CareerBridge AI?</h2>
          <p className="text-slate-200 text-lg mb-8">
            Run the stack locally with PostgreSQL, seed demo accounts, and walk through every portal.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register/student">
              <Button
                size="lg"
                className="bg-white text-brand-700 hover:bg-slate-50 border-white"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Create student account
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="secondary"
                className="bg-transparent text-white border-white/40 hover:bg-white/10"
              >
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-950 text-slate-400 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-brand-gradient rounded-lg flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white text-sm">CareerBridge AI</span>
              </div>
              <p className="text-sm leading-relaxed">Discover. Prepare. Apply. Get Hired.</p>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-4">Students</p>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/register/student" className="hover:text-white transition-colors">
                    Sign up
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-white transition-colors">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-4">Companies</p>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/register/company" className="hover:text-white transition-colors">
                    Post internships
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-white transition-colors">
                    Company login
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-4">Platform</p>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    About us
                  </Link>
                </li>
                <li>
                  <Link to="/admin/login" className="hover:text-white transition-colors">
                    Admin
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs">© {new Date().getFullYear()} CareerBridge AI. Portfolio & education use.</p>
            <div className="flex items-center gap-2 text-xs">
              <Users className="w-4 h-4" />
              <span>Students · Recruiters · Administrators</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
