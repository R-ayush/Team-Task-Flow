import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import Logo from '../components/ui/Logo'
import {
  ArrowRight,
  Shield,
  Users,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Layout,
  Menu,
  X,
  Sun,
  Moon,
  BookOpen,
  Briefcase,
  Mail,
  Lock,
  Scale,
} from 'lucide-react'

export default function LandingPage() {
  const { isAuthenticated } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSlider, setActiveSlider] = useState(null)

  // Interactive Kanban Widget State
  const [demoTasks, setDemoTasks] = useState([
    {
      id: 1,
      title: 'Design Glassmorphic Landing Page',
      desc: 'Build high-aesthetic dark slate visuals with animated gradient nodes.',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      dueDate: 'May 24',
    },
    {
      id: 2,
      title: 'Configure PostgreSQL Database',
      desc: 'Create projects, memberships, and tasks schemas on Supabase.',
      priority: 'HIGH',
      status: 'DONE',
      dueDate: 'May 22',
    },
    {
      id: 3,
      title: 'Secure JWT Authorization Controller',
      desc: 'Add bcryptjs password hashing and route validation checks.',
      priority: 'MEDIUM',
      status: 'TODO',
      dueDate: 'May 28',
    },
  ])
  const [newDemoTaskTitle, setNewDemoTaskTitle] = useState('')

  const addDemoTask = (e) => {
    e.preventDefault()
    if (!newDemoTaskTitle.trim()) return
    const newTask = {
      id: Date.now(),
      title: newDemoTaskTitle,
      desc: 'Demo sandbox task. Use arrows below to shift columns.',
      priority: 'MEDIUM',
      status: 'TODO',
      dueDate: 'Today',
    }
    setDemoTasks([...demoTasks, newTask])
    setNewDemoTaskTitle('')
  }

  // Cubic 3D Vertical Testimonial Slider State
  const [activeReviewIndex, setActiveReviewIndex] = useState(0)
  const reviews = [
    {
      name: 'Sarah Jenkins',
      role: 'Lead Engineer @ Vercel',
      avatar: 'SJ',
      text: 'We ditched our bloated enterprise board for TaskFlow. It is incredibly fast, and the interface is stunning. Developers actually enjoy updating their tickets now.',
      rating: 5,
    },
    {
      name: 'Marcus Chen',
      role: 'CTO @ Orbit Labs',
      avatar: 'MC',
      text: 'The Supabase backend integration is rock solid. The ability to invite team members and toggle permissions in real-time is exactly what our remote team was looking for.',
      rating: 5,
    },
    {
      name: 'Elena Rostova',
      role: 'Senior PM @ Supabase',
      avatar: 'ER',
      text: 'A task manager that stays out of your way. Swapping between visual Kanban columns and tabular list views is instant. Sub-100ms database response feels amazing.',
      rating: 5,
    },
    {
      name: 'David K.',
      role: 'Indie Hacker & Creator',
      avatar: 'DK',
      text: 'The dark glassmorphic layout is beautiful, but the speed is the real selling point. Keyboard-friendly navigation saves me hours of clicking every single week.',
      rating: 5,
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveReviewIndex((prev) => (prev + 1) % reviews.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [reviews.length])

  const moveTask = (taskId, direction) => {
    setDemoTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const columns = ['TODO', 'IN_PROGRESS', 'DONE']
          const currentIndex = columns.indexOf(t.status)
          let nextIndex = currentIndex + direction
          if (nextIndex >= 0 && nextIndex < columns.length) {
            return { ...t, status: columns[nextIndex] }
          }
        }
        return t
      })
    )
  }

  const getSliderTitle = () => {
    switch (activeSlider) {
      case 'about': return 'About TaskFlow';
      case 'blog': return 'Company Blog';
      case 'careers': return 'Careers';
      case 'contact': return 'Contact Us';
      case 'privacy': return 'Privacy Policy';
      case 'terms': return 'Terms of Service';
      case 'security': return 'Security Details';
      default: return '';
    }
  };

  const renderSliderContent = () => {
    switch (activeSlider) {
      case 'about':
        return (
          <div className="space-y-6 text-left">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-violet-400" /> Our Mission
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm">
                At TaskFlow, we are redefining modern collaboration. We build high-performance tools designed specifically for fast-moving engineering, design, and product teams.
              </p>
              <p className="text-slate-300 leading-relaxed text-sm">
                Our team-first mindset drives us to craft lightweight, visually stunning, and lightning-fast software that removes friction from your daily workflow so you can focus on building what matters.
              </p>
            </div>
            
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-3">
              <h4 className="text-sm font-semibold text-white">Core Values</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 mt-0.5">✦</span>
                  <span><strong>Aesthetic Excellence:</strong> Design is not just how it looks; it's how it works and feels.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 mt-0.5">✦</span>
                  <span><strong>Developer Velocity:</strong> Minimal page sizes, direct APIs, and zero unnecessary bloat.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 mt-0.5">✦</span>
                  <span><strong>User First:</strong> Creating experiences that people look forward to opening every day.</span>
                </li>
              </ul>
            </div>
          </div>
        );
      case 'blog':
        return (
          <div className="space-y-6 text-left">
            <div className="flex items-center gap-2 text-violet-400">
              <BookOpen className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-wider text-left">Product & Engineering Insights</span>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition-all group cursor-pointer text-left">
                <span className="text-[10px] bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded-full font-medium">Engineering</span>
                <h4 className="text-sm font-semibold text-white mt-2 group-hover:text-violet-300 transition-colors">
                  Why Fast Refresh and Modular Code Make or Break Your Team's Velocity
                </h4>
                <p className="text-slate-400 text-xs mt-1 line-clamp-2">
                  Exploring the engineering decisions that keep React hot reloads running in under 200ms across large workspaces.
                </p>
                <div className="flex items-center gap-4 mt-3 text-[10px] text-slate-500">
                  <span>May 20, 2026</span>
                  <span>•</span>
                  <span>5 min read</span>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition-all group cursor-pointer text-left">
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-medium">Design</span>
                <h4 className="text-sm font-semibold text-white mt-2 group-hover:text-emerald-300 transition-colors">
                  The Power of Glassmorphism in Enterprise Dashboards
                </h4>
                <p className="text-slate-400 text-xs mt-1 line-clamp-2">
                  A deep dive into how transparency, backdrop-filters, and dynamic gradients keep information readable and aesthetically premium.
                </p>
                <div className="flex items-center gap-4 mt-3 text-[10px] text-slate-500">
                  <span>May 18, 2026</span>
                  <span>•</span>
                  <span>4 min read</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition-all group cursor-pointer text-left">
                <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full font-medium">Productivity</span>
                <h4 className="text-sm font-semibold text-white mt-2 group-hover:text-amber-300 transition-colors">
                  Visual Kanban Boards: Overcoming Cognitive Load
                </h4>
                <p className="text-slate-400 text-xs mt-1 line-clamp-2">
                  How high-contrast columns, color-coded priorities, and real-time state sync keep distributed groups aligned without status meetings.
                </p>
                <div className="flex items-center gap-4 mt-3 text-[10px] text-slate-500">
                  <span>May 15, 2026</span>
                  <span>•</span>
                  <span>6 min read</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'careers':
        return (
          <div className="space-y-6 text-left">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-violet-400" /> Join Our Team
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                We're a remote-first group of passionate designers, engineers, and product minds building the future of work. Join us in setting new standards for visual software.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between items-start text-left">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-white">Senior Frontend Architect</h4>
                  <div className="flex gap-2">
                    <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded">Remote</span>
                    <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded">Full-Time</span>
                  </div>
                </div>
                <button className="text-xs bg-violet-600 hover:bg-violet-500 text-white font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                  Apply
                </button>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between items-start text-left">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-white">Product Designer (UI/UX)</h4>
                  <div className="flex gap-2">
                    <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded">Remote</span>
                    <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded">Full-Time</span>
                  </div>
                </div>
                <button className="text-xs bg-violet-600 hover:bg-violet-500 text-white font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                  Apply
                </button>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between items-start text-left">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-white">Senior Backend Engineer</h4>
                  <div className="flex gap-2">
                    <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded">Hybrid</span>
                    <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded">Full-Time</span>
                  </div>
                </div>
                <button className="text-xs bg-violet-600 hover:bg-violet-500 text-white font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                  Apply
                </button>
              </div>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-6 text-left">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-violet-400" /> Get in Touch
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Have questions about enterprise plans, integrations, or custom requirements? Send us a message and our team will get back to you within 12 hours.
              </p>
            </div>
            
            <form className="space-y-4 text-left" onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); }}>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Your Name" 
                  className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                <input 
                  type="email" 
                  required 
                  placeholder="you@company.com" 
                  className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Message</label>
                <textarea 
                  rows={4} 
                  required 
                  placeholder="How can we help?" 
                  className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium text-sm py-3 rounded-lg transition-all shadow-lg shadow-violet-500/20 cursor-pointer"
              >
                Send Message
              </button>
            </form>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-6 text-slate-300 text-sm leading-relaxed text-left">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-violet-400" /> Privacy Policy
            </h3>
            <p>
              Last Updated: May 22, 2026. Your privacy is paramount. This Privacy Policy describes how TaskFlow collects, uses, and safeguards your information when you use our SaaS application.
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-1">1. Information We Collect</h4>
                <p className="text-slate-400 text-xs">
                  We collect account credentials, profile configurations, membership records, and workflow data (such as project lists and task descriptions) necessary to deliver our real-time collaboration features.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-1">2. How We Secure Data</h4>
                <p className="text-slate-400 text-xs">
                  All transactions and API calls are secured via JSON Web Tokens (JWT) and Transport Layer Security (TLS). Data is stored inside protected PostgreSQL instances on Supabase with restricted schema permissions.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-1">3. Your Rights</h4>
                <p className="text-slate-400 text-xs">
                  You retain the right to query, correct, export, or completely delete your personal information and associated team records. Please reach out to our privacy officer for custom data erasure tasks.
                </p>
              </div>
            </div>
          </div>
        );
      case 'terms':
        return (
          <div className="space-y-6 text-slate-300 text-sm leading-relaxed text-left">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-violet-400" /> Terms of Service
            </h3>
            <p>
              Welcome to TaskFlow. By accessing or using our real-time project collaboration platform, you agree to comply with and be bound by these Terms of Service.
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-1">1. Account Registration</h4>
                <p className="text-slate-400 text-xs">
                  You must provide valid, accurate registration details. You are entirely responsible for keeping your JWT, passwords, and service-role secrets private. Suspicion of abuse may lead to account holds.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-1">2. Permitted Use</h4>
                <p className="text-slate-400 text-xs">
                  You may use the platform to organize tasks, assign project memberships, and construct agile workflow pipelines. Automated scraping, DDoS attempts, or malicious reverse-engineering are strictly prohibited.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-1">3. Termination</h4>
                <p className="text-slate-400 text-xs">
                  We reserve the right to suspend accounts that fail payment runs or break service rules, with or without prior notice, although we aim to notify users 72 hours in advance of any service cutoffs.
                </p>
              </div>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6 text-slate-300 text-sm leading-relaxed text-left">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-violet-400" /> Security Details
            </h3>
            <p>
              TaskFlow is engineered to support professional teams with enterprise-grade data security standards.
            </p>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-left">
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Infrastructure Security
                </h4>
                <p className="text-slate-400 text-xs">
                  Our databases are hosted on Supabase and run within secure AWS environments protected by hardware firewalls. Database connections are limited to TLS/SSL.
                </p>
              </div>
              
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-left">
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Authentication & Encryption
                </h4>
                <p className="text-slate-400 text-xs">
                  User passwords are encrypted with bcryptjs (work-factor 10) before database storage. API endpoints require cryptographic validation via JWT, securing project records from data exposure.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-left">
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Data Isolation
                </h4>
                <p className="text-slate-400 text-xs">
                  Row-level check conditions are enforced during project edits, validating that the calling user possesses appropriate project member rights before read/write operations execute.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 overflow-x-hidden relative font-sans">
      {/* Background Nodes */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-[20%] w-[600px] h-[600px] rounded-full bg-primary-500/5 blur-[150px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/[0.06] bg-[#0f172a]/70 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo className="w-9 h-9" />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-300 hover:text-white hover:translate-y-[-1px] transition-all">
              Features
            </a>
            <a href="#preview" className="text-sm text-slate-300 hover:text-white hover:translate-y-[-1px] transition-all">
              Live Preview
            </a>
            <a href="#stats" className="text-sm text-slate-300 hover:text-white hover:translate-y-[-1px] transition-all">
              Metrics
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-white/[0.06] bg-slate-900/40 text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all hover:scale-105 active:scale-95"
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button className="gap-2 shadow-lg shadow-primary-500/20">
                  Dashboard <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-slate-300 hover:text-white">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="shadow-lg shadow-primary-500/20">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 md:hidden transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-white/[0.06] bg-[#0f172a]/95 backdrop-blur-2xl p-6 space-y-4 animate-fade-in">
            <nav className="flex flex-col gap-4">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-white font-medium"
              >
                Features
              </a>
              <a
                href="#preview"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-white font-medium"
              >
                Live Preview
              </a>
              <a
                href="#stats"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-white font-medium"
              >
                Metrics
              </a>
            </nav>
            <div className="pt-4 border-t border-white/[0.06] flex flex-col gap-4">
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-sm font-medium text-slate-400">Theme</span>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/[0.06] bg-slate-900/40 text-slate-300 hover:text-white"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-medium">Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-medium">Dark Mode</span>
                    </>
                  )}
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {isAuthenticated ? (
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full gap-2">
                      Dashboard <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full">
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-slate-900/40 text-slate-400 text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Open Source & Built for Developers
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
          Issue tracking,<br />
          <span className="text-gradient font-extrabold">without the bloat.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-400 leading-relaxed mb-10">
          An elegant, keyboard-navigable workspace designed for high-performing engineering teams. Coordinate tasks, delegate responsibilities, and analyze project metrics with zero friction.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button size="lg" className="h-12 px-8 text-base gap-2 shadow-lg shadow-primary-500/20 hover:scale-105 transition-transform duration-200">
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/register">
                <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary-500/20 hover:scale-105 transition-transform duration-200">
                  Get Started for Free
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base border-white/[0.08] hover:bg-slate-800/40">
                  View Demo Dashboard
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Cards */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.06]">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            A cleaner workflow. Done right.
          </h2>
          <p className="text-slate-400 text-sm">
            No complex configuration dashboards, no slow queries. Just the tools you need to build and ship software.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-white/[0.06] bg-slate-900/40 backdrop-blur-xl hover:border-primary-500/40 transition-all duration-300 group hover:-translate-y-1">
            <CardContent className="p-8">
              <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 mb-6 group-hover:bg-primary-500/20 transition-colors">
                <Layout className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Fluid Kanban & Table Views</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Swap instantly between a visual task board and a keyboard-friendly tabular grid display. Designed to give developers and managers their favorite views.
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/[0.06] bg-slate-900/40 backdrop-blur-xl hover:border-teal-500/40 transition-all duration-300 group hover:-translate-y-1">
            <CardContent className="p-8">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-6 group-hover:bg-teal-500/20 transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Granular Access Roles</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Invite team members and manage permissions instantly. Assign Admin roles to control settings and task configurations, or keep users as standard Members.
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/[0.06] bg-slate-900/40 backdrop-blur-xl hover:border-primary-500/40 transition-all duration-300 group hover:-translate-y-1">
            <CardContent className="p-8">
              <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 mb-6 group-hover:bg-primary-500/20 transition-colors">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Supabase-Backed Security</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enjoy instant updates with Node, Express, and JWT security tokens. Rest assured that all databases query parameters are fully sanitised and protected.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Interactive Kanban Widget Showcase */}
      <section id="preview" className="max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.06] relative">
        <div className="absolute top-[20%] left-[-5%] w-[300px] h-[300px] rounded-full bg-primary-500/5 blur-[100px] pointer-events-none" />
        
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Try It Right Now
          </h2>
          <p className="text-slate-400">
            Interact with our live simulation board below. Shift tasks between statuses to experience the smooth reactivity.
          </p>
        </div>

        {/* Board Simulation */}
        <div className="glass-light border-white/[0.06] rounded-2xl p-6 md:p-8 max-w-5xl mx-auto shadow-2xl relative z-10">
          {/* Interactive sandbox task addition */}
          <div className="max-w-md mx-auto mb-8 text-center bg-slate-950/40 p-4 rounded-xl border border-white/[0.04]">
            <p className="text-[11px] text-slate-400 font-medium mb-3">
              Interactive sandbox control: Type a task title below to test adding live tickets.
            </p>
            <form onSubmit={addDemoTask} className="flex gap-2">
              <input
                type="text"
                placeholder="Write a task (e.g., Integrate OAuth2 login)..."
                value={newDemoTaskTitle}
                onChange={(e) => setNewDemoTaskTitle(e.target.value)}
                className="flex-1 bg-slate-950/80 border border-white/[0.08] focus:border-primary-500/50 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary-500/30"
              />
              <Button type="submit" className="text-xs h-9 px-4 bg-primary-600 hover:bg-primary-500 text-white font-medium">
                Add Task
              </Button>
            </form>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Columns */}
            {['TODO', 'IN_PROGRESS', 'DONE'].map((col) => {
              const taskList = demoTasks.filter((t) => t.status === col)
              const colLabel = {
                TODO: 'To Do',
                IN_PROGRESS: 'In Progress',
                DONE: 'Completed',
              }

              return (
                <div key={col} className="flex-1 bg-slate-950/40 rounded-xl p-4 border border-white/[0.04]">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/[0.04]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                      <span className="font-semibold text-sm text-white">{colLabel[col]}</span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{taskList.length}</span>
                  </div>

                  <div className="space-y-4">
                    {taskList.length === 0 ? (
                      <div className="border border-dashed border-white/[0.06] rounded-xl py-12 text-center">
                        <p className="text-xs text-slate-600">Drag or move tasks here</p>
                      </div>
                    ) : (
                      taskList.map((task) => (
                        <div
                          key={task.id}
                          className="bg-slate-900/80 border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.15] transition-all duration-200 hover:-translate-y-0.5"
                        >
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <span className="text-xs font-semibold text-white leading-tight">
                              {task.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-normal mb-4">
                            {task.desc}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-500" /> {task.dueDate}
                            </span>

                            <div className="flex gap-1.5">
                              {col !== 'TODO' && (
                                <button
                                  onClick={() => moveTask(task.id, -1)}
                                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                  title="Move Left"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {col !== 'DONE' && (
                                <button
                                  onClick={() => moveTask(task.id, 1)}
                                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                  title="Move Right"
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Reviews/Testimonials Section with Cubic 3D Vertical Rotation */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/[0.06] relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-[50%] right-[-10%] w-[350px] h-[350px] rounded-full bg-primary-500/5 blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Column: Descriptive authentic copy */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/[0.06] bg-slate-900/40 text-slate-400 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" /> Loved by High-Performing Teams
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Built for developers who value <span className="text-gradient">speed and polish.</span>
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              We asked senior engineering leaders, startup founders, and indie hackers what they wanted in an issue tracker. The answer was simple: keyboard shortcuts, instant loading, and an interface that isn't painful to look at. Here's how teams are building with TaskFlow.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                {['SJ', 'MC', 'ER', 'DK'].map((init, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border border-[#0f172a] bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-primary-500/10"
                  >
                    {init}
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Used by developers across modern startups worldwide.
              </p>
            </div>
          </div>

          {/* Right Column: Dynamic Cubic 3D Vertical Rotating Slider */}
          <div className="lg:col-span-7 flex items-center justify-center py-8">
            <div
              className="relative h-[250px] w-full max-w-[480px]"
              style={{ transformStyle: 'preserve-3d', perspective: '1200px' }}
            >
              {reviews.map((review, index) => {
                let offset = index - activeReviewIndex
                if (offset < 0) {
                  offset += reviews.length
                }

                let style;

                if (offset === 0) {
                  // Active card: top front
                  style = {
                    transform: 'translateY(0px) translateZ(0px) rotateX(0deg) scale(1)',
                    opacity: 1,
                    zIndex: 30,
                  }
                } else if (offset === 1) {
                  // Previous card: below it, tilted and faded (looking down)
                  style = {
                    transform: 'translateY(75px) translateZ(-40px) rotateX(-12deg) scale(0.94)',
                    opacity: 0.7,
                    zIndex: 20,
                  }
                } else if (offset === 2) {
                  // Second previous card: even lower, more faded
                  style = {
                    transform: 'translateY(145px) translateZ(-80px) rotateX(-24deg) scale(0.88)',
                    opacity: 0.3,
                    zIndex: 10,
                  }
                } else if (offset === reviews.length - 1) {
                  // Transitioning card: exiting/entering from the top
                  style = {
                    transform: 'translateY(-75px) translateZ(-40px) rotateX(12deg) scale(0.94)',
                    opacity: 0,
                    zIndex: 0,
                  }
                } else {
                  // Hidden cards
                  style = {
                    transform: 'translateY(200px) translateZ(-120px) rotateX(-35deg) scale(0.8)',
                    opacity: 0,
                    zIndex: 0,
                  }
                }

                return (
                  <div
                    key={index}
                    style={{
                      ...style,
                      transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    className="absolute inset-x-0 mx-auto w-full max-w-[440px] origin-center pointer-events-none select-none"
                  >
                    <div className="glass border-white/[0.06] bg-slate-900/90 backdrop-blur-xl p-5 md:p-6 rounded-2xl shadow-2xl space-y-4">
                      {/* Star Ratings */}
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-4 h-4 text-amber-400 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>

                      {/* Review text */}
                      <p className="text-slate-300 text-xs md:text-sm leading-relaxed italic">
                        "{review.text}"
                      </p>

                      {/* User Info */}
                      <div className="flex items-center gap-3 pt-3 border-t border-white/[0.04]">
                        <div className="w-8 h-8 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-xs font-bold text-primary-300">
                          {review.avatar}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-white truncate leading-tight">
                            {review.name}
                          </h4>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">
                            {review.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
             </div>
           </div>
         </div>
       </section>

       {/* Metrics Section */}
       <section id="stats" className="max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.06]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-4xl mx-auto">
          <div>
            <p className="text-4xl md:text-5xl font-extrabold text-white mb-2 text-gradient">10k+</p>
            <p className="text-xs md:text-sm text-slate-500 uppercase tracking-widest font-semibold">Tasks Completed</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-extrabold text-white mb-2 text-gradient">99.9%</p>
            <p className="text-xs md:text-sm text-slate-500 uppercase tracking-widest font-semibold">Server Uptime</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-extrabold text-white mb-2 text-gradient">500+</p>
            <p className="text-xs md:text-sm text-slate-500 uppercase tracking-widest font-semibold">Active Teams</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-extrabold text-white mb-2 text-gradient">&lt;100ms</p>
            <p className="text-xs md:text-sm text-slate-500 uppercase tracking-widest font-semibold">API Latency</p>
          </div>
        </div>
      </section>

      {/* Footer Call to Action */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.06] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary-500/[0.02] to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Boost Your Team's Velocity?</h2>
          <p className="text-slate-400 text-base max-w-lg mx-auto mb-8">
            Create projects, assign tasks, and track real-time dashboard analytics with your team in a sleek, glassmorphic workspace.
          </p>
          <div className="flex justify-center">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg" className="h-12 px-8 text-base gap-2 shadow-lg shadow-primary-500/20 hover:scale-105 transition-transform duration-200">
                  Open Your Dashboard <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button size="lg" className="h-12 px-8 text-base gap-2 shadow-lg shadow-primary-500/20 hover:scale-105 transition-transform duration-200">
                  Get Started for Free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Beautiful Multi-Column Footer */}
      <footer className="border-t border-white/[0.06] bg-slate-950/50 relative overflow-hidden">
        {/* Subtle decorative glows inside the footer */}
        <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full bg-primary-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] rounded-full bg-teal-500/5 blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            {/* Logo and Tagline Column */}
            <div className="lg:col-span-2 space-y-6 text-left">
              <Logo className="w-10 h-10" />
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                TaskFlow is a state-of-the-art team collaboration platform designed to streamline your workflows, track task metrics, and amplify your team's velocity with elegant glassmorphic visuals.
              </p>
              {/* Social Links */}
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl border border-white/[0.06] bg-slate-900/40 flex items-center justify-center text-slate-400 hover:text-white hover:border-primary-500/40 hover:scale-110 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-200"
                  aria-label="GitHub"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl border border-white/[0.06] bg-slate-900/40 flex items-center justify-center text-slate-400 hover:text-white hover:border-primary-500/40 hover:scale-110 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-200"
                  aria-label="Twitter"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl border border-white/[0.06] bg-slate-900/40 flex items-center justify-center text-slate-400 hover:text-white hover:border-primary-500/40 hover:scale-110 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-200"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/>
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl border border-white/[0.06] bg-slate-900/40 flex items-center justify-center text-slate-400 hover:text-white hover:border-primary-500/40 hover:scale-110 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-200"
                  aria-label="YouTube"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Product */}
            <div className="space-y-4 text-left">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Product</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a href="#features" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all">Features</a>
                </li>
                <li>
                  <a href="#preview" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all">Live Preview</a>
                </li>
                <li>
                  <a href="#stats" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all">Metrics</a>
                </li>
                <li>
                  <span className="text-slate-500 flex items-center gap-1.5 cursor-not-allowed">
                    Roadmap <Badge className="text-[9px] px-1.5 py-0 bg-primary-500/10 text-primary-300 border-none">Soon</Badge>
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div className="space-y-4 text-left">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Resources</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <span className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all cursor-pointer">Documentation</span>
                </li>
                <li>
                  <span className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all cursor-pointer">API Reference</span>
                </li>
                <li>
                  <span className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all cursor-pointer">Changelog</span>
                </li>
                <li>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="hover:text-white cursor-pointer text-xs">All Systems Live</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 4: Company */}
            <div className="space-y-4 text-left">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Company</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <span 
                    onClick={() => setActiveSlider('about')}
                    className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all cursor-pointer"
                  >
                    About Us
                  </span>
                </li>
                <li>
                  <span 
                    onClick={() => setActiveSlider('blog')}
                    className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all cursor-pointer"
                  >
                    Blog
                  </span>
                </li>
                <li>
                  <span 
                    onClick={() => setActiveSlider('careers')}
                    className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all cursor-pointer"
                  >
                    Careers
                  </span>
                </li>
                <li>
                  <span 
                    onClick={() => setActiveSlider('contact')}
                    className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all cursor-pointer"
                  >
                    Contact Us
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 mt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              <span>&copy; {new Date().getFullYear()} TaskFlow. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6">
              <span 
                onClick={() => setActiveSlider('privacy')}
                className="hover:text-slate-300 cursor-pointer transition-colors"
              >
                Privacy Policy
              </span>
              <span 
                onClick={() => setActiveSlider('terms')}
                className="hover:text-slate-300 cursor-pointer transition-colors"
              >
                Terms of Service
              </span>
              <span 
                onClick={() => setActiveSlider('security')}
                className="hover:text-slate-300 cursor-pointer transition-colors"
              >
                Security Details
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Right Drawer Slider */}
      <div 
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${activeSlider ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          onClick={() => setActiveSlider(null)}
        />
        
        {/* Panel */}
        <div 
          className={`absolute top-0 right-0 h-full w-full max-w-md bg-slate-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl flex flex-col transition-transform duration-300 ease-out transform ${activeSlider ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-lg font-bold text-white tracking-wide">
              {getSliderTitle()}
            </h2>
            <button 
              onClick={() => setActiveSlider(null)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {renderSliderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}
