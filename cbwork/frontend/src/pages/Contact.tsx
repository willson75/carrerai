import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Clock3, Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'

const topics = ['General enquiry', 'Student support', 'Company / recruiter support', 'Technical issue', 'Partnership']

export function Contact() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', topic: topics[0], subject: '', message: '' })
  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'Unable to send your message. Please try again.')
      setSubmitted(true)
      setForm({ name: '', email: '', topic: topics[0], subject: '', message: '' })
      toast.success('Your message has been sent!')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to send your message.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="bg-brand-950 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-accent-300 mb-5">
              <MessageSquare className="w-4 h-4" /> We're here to help
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Let's talk about your next step.</h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-300 max-w-2xl">
              Have a question about internships, your profile, or hiring on CareerBridge? Send our team a message and we'll help you find the right way forward.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8 items-start">
          <aside className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">Contact information</h2>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">Choose whichever channel works best. Our support team is happy to point you in the right direction.</p>
              <div className="mt-6 space-y-5">
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center shrink-0"><Mail className="w-5 h-5" /></div>
                  <div><p className="font-semibold text-slate-900">Email us</p><a className="text-sm text-primary-700 hover:underline" href="mailto:support@careerbridge.example">support@careerbridge.example</a><p className="text-xs text-slate-500 mt-1">For questions and support</p></div>
                </div>
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center shrink-0"><Phone className="w-5 h-5" /></div>
                  <div><p className="font-semibold text-slate-900">Call our team</p><a className="text-sm text-primary-700 hover:underline" href="tel:+917955501234">+91 79 5550 1234</a><p className="text-xs text-slate-500 mt-1">Demo contact — replace before publishing</p></div>
                </div>
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center shrink-0"><Clock3 className="w-5 h-5" /></div>
                  <div><p className="font-semibold text-slate-900">Support hours</p><p className="text-sm text-slate-600">Monday–Friday</p><p className="text-xs text-slate-500 mt-1">10:00 AM – 6:00 PM IST</p></div>
                </div>
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center shrink-0"><MapPin className="w-5 h-5" /></div>
                  <div><p className="font-semibold text-slate-900">Based in India</p><p className="text-sm text-slate-600">Serving students and recruiters online</p><p className="text-xs text-slate-500 mt-1">Remote-first support</p></div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-primary-50 border border-primary-100 p-6">
              <h3 className="font-bold text-slate-900">Looking for an opportunity?</h3>
              <p className="text-sm text-slate-600 mt-2">Explore internships and take the next step in your career journey.</p>
              <Link to="/register/student" className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-primary-700 hover:underline">Create a student account <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </aside>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            {submitted && <div role="status" className="mb-6 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800"><CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /><div><p className="font-semibold">Message received</p><p className="text-sm mt-1">Thanks for contacting CareerBridge. Your message has been saved and our team can follow up.</p></div></div>}
            <div className="mb-7"><h2 className="text-2xl font-bold text-slate-900">Send us a message</h2><p className="text-sm text-slate-500 mt-2">Complete the form below. Fields marked * are required.</p></div>
            <form onSubmit={submit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div><label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Full name *</label><input id="name" name="name" required minLength={2} maxLength={80} value={form.name} onChange={update} placeholder="Your full name" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" /></div>
                <div><label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email address *</label><input id="email" name="email" type="email" required maxLength={254} value={form.email} onChange={update} placeholder="you@example.com" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div><label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-2">What can we help with? *</label><select id="topic" name="topic" value={form.topic} onChange={update} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100">{topics.map((topic) => <option key={topic}>{topic}</option>)}</select></div>
                <div><label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">Subject *</label><input id="subject" name="subject" required minLength={3} maxLength={120} value={form.subject} onChange={update} placeholder="How can we help?" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" /></div>
              </div>
              <div><label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Your message *</label><textarea id="message" name="message" required minLength={10} maxLength={3000} rows={6} value={form.message} onChange={update} placeholder="Tell us a little more about your question..." className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" /><p className="text-xs text-slate-400 text-right mt-1">{form.message.length}/3000 characters</p></div>
              <Button type="submit" size="lg" className="w-full sm:w-auto" isLoading={loading} leftIcon={<Send className="w-4 h-4" />}>{loading ? 'Sending message…' : 'Send message'}</Button>
              <p className="text-xs text-slate-400">Please don't include passwords, payment details, or other sensitive information.</p>
            </form>
          </div>
        </div>
      </section>
      <footer className="border-t border-slate-200 bg-white py-7"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row gap-3 justify-between text-sm text-slate-500"><span>© {new Date().getFullYear()} CareerBridge AI. Built to help careers move forward.</span><div className="flex gap-5"><Link to="/about" className="hover:text-primary-700">About</Link><Link to="/" className="hover:text-primary-700">Home</Link></div></div></footer>
    </div>
  )
}

export default Contact
