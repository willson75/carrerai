import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import ContactMessage from '../models/ContactMessage.js'

const router = Router()
const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: 'draft-7', legacyHeaders: false, message: { message: 'Too many messages submitted. Please try again in 15 minutes.' } })
const topics = ['General enquiry', 'Student support', 'Company / recruiter support', 'Technical issue', 'Partnership']

router.post('/', contactLimiter, async (req, res, next) => {
  try {
    const { name, email, topic, subject, message } = req.body ?? {}
    if (![name, email, topic, subject, message].every((value) => typeof value === 'string' && value.trim())) {
      return res.status(400).json({ message: 'Please complete all required fields.' })
    }
    if (name.trim().length < 2 || name.trim().length > 80) return res.status(400).json({ message: 'Name must be between 2 and 80 characters.' })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || email.trim().length > 254) return res.status(400).json({ message: 'Enter a valid email address.' })
    if (!topics.includes(topic)) return res.status(400).json({ message: 'Select a valid enquiry topic.' })
    if (subject.trim().length < 3 || subject.trim().length > 120) return res.status(400).json({ message: 'Subject must be between 3 and 120 characters.' })
    if (message.trim().length < 10 || message.trim().length > 3000) return res.status(400).json({ message: 'Message must be between 10 and 3000 characters.' })

    const saved = await ContactMessage.create({ name, email, topic, subject, message })
    return res.status(201).json({ message: 'Your message has been received.', id: saved._id })
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ message: 'Please check your details and try again.' })
    return next(error)
  }
})

export default router
