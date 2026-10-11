import mongoose from 'mongoose'

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  topic: { type: String, required: true, enum: ['General enquiry', 'Student support', 'Company / recruiter support', 'Technical issue', 'Partnership'] },
  subject: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
  message: { type: String, required: true, trim: true, minlength: 10, maxlength: 3000 },
  status: { type: String, enum: ['new', 'in_progress', 'resolved'], default: 'new' },
}, { timestamps: true })

export default mongoose.model('ContactMessage', contactMessageSchema)
