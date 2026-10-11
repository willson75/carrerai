import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
const loose = new mongoose.Schema({}, {strict:false,timestamps:true,versionKey:false})
const User = mongoose.models.User || mongoose.model('User',loose,'user')
const Internship = mongoose.models.Internship || mongoose.model('Internship',loose,'internship')
const Skill = mongoose.models.StudentSkill || mongoose.model('StudentSkill',loose,'studentskill')
if(!process.env.MONGODB_URI) throw new Error('Set MONGODB_URI in .env first')
await mongoose.connect(process.env.MONGODB_URI)
const samples=[
 {title:'Frontend Developer Intern',company_name:'BrightPath Technologies',location:'Remote, India',type:'Internship',duration:'3 months',stipend:12000,description:'Build responsive React interfaces, integrate APIs, and collaborate with product designers.',required_skills:['HTML','CSS','JavaScript','React'],preferred_skills:['TypeScript','Git'],status:'published'},
 {title:'Backend Developer Intern',company_name:'CloudNova Labs',location:'Ahmedabad, India',type:'Internship',duration:'6 months',stipend:1500,description:'Develop REST APIs, work with databases, write tests, and learn production backend practices.',required_skills:['Node.js','Express','MongoDB','REST API'],preferred_skills:['Docker','Testing'],status:'published'},
 {title:'Data Analyst Intern',company_name:'InsightWorks',location:'Hybrid, India',type:'Internship',duration:'4 months',stipend:10000,description:'Clean datasets, create dashboards, and explain findings to business stakeholders.',required_skills:['Python','SQL','Excel'],preferred_skills:['Power BI','Statistics'],status:'published'},
 {title:'UI/UX Design Intern',company_name:'PixelSpring Studio',location:'Remote, India',type:'Internship',duration:'3 months',stipend:8000,description:'Create wireframes, prototypes, and accessible user flows with a design team.',required_skills:['Figma','Wireframing','Prototyping'],preferred_skills:['Accessibility','Design Systems'],status:'published'},
 {title:'QA Automation Intern',company_name:'QualityStack',location:'Pune, India',type:'Internship',duration:'4 months',stipend:11000,description:'Create test cases, report defects, and automate key web application flows.',required_skills:['Testing','JavaScript','Git'],preferred_skills:['Playwright','API Testing'],status:'published'}]
let added=0
for(const item of samples){if(!await Internship.findOne({title:item.title,company_name:item.company_name})){await Internship.create(item);added++}}
if(process.env.SEED_ADMIN_EMAIL&&process.env.SEED_ADMIN_PASSWORD){const email=process.env.SEED_ADMIN_EMAIL.toLowerCase();if(!await User.findOne({email})){await User.create({email,password_hash:await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD,12),role:'admin',first_name:'CareerBridge',last_name:'Admin',is_active:true});console.log('Created administrator:',email)}}
console.log(`Seed complete. Added ${added} sample internships.`)
await mongoose.disconnect()
