import React from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Heart, Target, Users, Zap, ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'

const values = [
  {
    icon: Heart,
    title: 'Student-first',
    description: 'Every feature we build starts with one question: does this help students succeed?',
  },
  {
    icon: Zap,
    title: 'AI-powered',
    description: 'We harness cutting-edge AI to remove guesswork and surface the right opportunity for each person.',
  },
  {
    icon: Target,
    title: 'Outcome-focused',
    description: 'We measure success by real placements, not just sign-ups or page views.',
  },
  {
    icon: Users,
    title: 'Inclusive',
    description: 'Great talent is everywhere. We remove barriers so opportunity reaches every student, everywhere.',
  },
]

const team = [
  { name: 'Dr. Adeola Okafor', role: 'Co-founder & CEO', initials: 'AO' },
  { name: 'James Mensah', role: 'Co-founder & CTO', initials: 'JM' },
  { name: 'Fatima Al-Hassan', role: 'Head of Product', initials: 'FA' },
  { name: 'Chen Wei', role: 'Head of AI/ML', initials: 'CW' },
]

export function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">About CareerBridge AI</h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            We're on a mission to make high-quality career opportunities accessible to every
            student, regardless of background or network.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Our story</h2>
              <p className="text-slate-500 leading-relaxed mb-4">
                CareerBridge AI was born from a simple frustration: talented students were missing
                out on great internships not because they lacked ability, but because they lacked
                guidance, connections, and the right tools.
              </p>
              <p className="text-slate-500 leading-relaxed mb-4">
                We built a platform that uses AI to bridge that gap — intelligently matching
                students with opportunities that fit their unique profile, while helping them
                prepare effectively for each application.
              </p>
              <p className="text-slate-500 leading-relaxed">
                Today, we work with students across 50+ universities and 3,500+ companies to
                make career success more equitable and achievable.
              </p>
            </div>
            <div className="bg-primary-50 rounded-2xl p-8 border border-primary-100">
              <div className="space-y-6">
                {[
                  { label: 'Founded', value: '2023' },
                  { label: 'Universities', value: '50+' },
                  { label: 'Partner companies', value: '3,500+' },
                  { label: 'Students placed', value: '12,000+' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-slate-500 text-sm">{label}</span>
                    <span className="font-bold text-primary-700 text-lg">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Our values</h2>
            <p className="text-slate-500">What drives every decision we make.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="card p-6">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center mb-4 text-primary-600">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Meet the team</h2>
            <p className="text-slate-500">The people building CareerBridge AI.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {team.map(({ name, role, initials }) => (
              <div key={name} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 font-bold text-xl flex items-center justify-center mx-auto mb-3">
                  {initials}
                </div>
                <p className="font-semibold text-slate-900 text-sm">{name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Join CareerBridge AI today</h2>
          <p className="text-primary-200 mb-8">
            Whether you're a student looking for opportunities or a company looking for talent,
            we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register/student">
              <Button
                size="lg"
                className="bg-white text-primary-600 hover:bg-primary-50 border-white focus:ring-white"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Get started free
              </Button>
            </Link>
            <Link to="/register/company">
              <Button
                size="lg"
                variant="ghost"
                className="text-white hover:bg-primary-700 border border-primary-400"
              >
                Post internships
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
