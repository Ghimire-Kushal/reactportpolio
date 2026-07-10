import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Github, Linkedin, Mail, ArrowRight, Download, Send, CheckCircle2 } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import api from '../api/client'

export default function PublicPage({ section = 'home' }) {
  const [settings, setSettings] = useState({})
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const navigate = useNavigate()

  const containerRef = useRef(null)
  const homeRef = useRef(null)
  const contactRef = useRef(null)

  // Expose scroll function globally for Navbar
  useEffect(() => {
    window.__scrollToSection = (s) => {
      const map = { home: homeRef, contact: contactRef }
      map[s]?.current?.scrollIntoView({ behavior: 'smooth' })
    }
    return () => { delete window.__scrollToSection }
  }, [])

  // Scroll to section on mount based on prop
  useEffect(() => {
    const map = { home: homeRef, contact: contactRef }
    setTimeout(() => map[section]?.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }, [section])

  useEffect(() => {
    api.get('/settings').then(r => setSettings(r.data)).catch(() => {})
  }, [])

  const handleResume = () => {
    const a = document.createElement('a')
    a.href = '/api/upload/resume/download'
    a.download = 'Kushal-Ghimire-Resume.pdf'
    a.click()
  }

  const handleContact = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      await api.post('/contact', contactForm)
      setSent(true)
      toast.success('Message sent!')
    } catch {
      toast.error('Failed to send. Try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <Helmet><title>{settings.site_name || 'Kushal Ghimire'} – Portfolio</title></Helmet>

      <div ref={containerRef}
        className="h-[calc(100vh-4rem)] overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

        {/* ── SECTION 1: HOME ── */}
        <section ref={homeRef} id="home"
          className="snap-start h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4">

          <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-dark-muted border border-gray-200 dark:border-dark-border rounded-full px-5 py-2 text-sm text-gray-700 dark:text-gray-300 mb-8 animate-[fadeInUp_0.4s_ease_both]">
            🚀 {settings.hero_subtitle || 'Building Scalable Web Applications'}
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-extrabold text-gray-900 dark:text-white mb-5 tracking-tight animate-[fadeInUp_0.5s_ease_both]">
            {settings.site_name || 'Kushal Ghimire'}
          </h1>

          <p className="text-base sm:text-xl lg:text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-6 px-2 animate-[fadeInUp_0.6s_ease_both]">
            {settings.hero_title || 'Frontend Developer · Backend Specialist · Vibe Coder'}
          </p>

          <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-xl leading-relaxed mb-10 px-2 animate-[fadeInUp_0.7s_ease_both]">
            {settings.bio || 'I design and develop high-performance applications with clean architecture and modern UI.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 w-full px-4 sm:px-0 animate-[fadeInUp_0.8s_ease_both]">
            <button onClick={() => navigate('/projects')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40">
              View My Work <ArrowRight size={16} />
            </button>
            <button onClick={handleResume}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-200 font-semibold px-8 py-3.5 rounded-xl border-2 border-gray-300 dark:border-dark-border transition-colors">
              <Download size={16} /> Download Resume
            </button>
          </div>

          <div className="flex items-center justify-center gap-7 animate-[fadeInUp_0.9s_ease_both]">
            {settings.github_url && <a href={settings.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"><Github size={24} /></a>}
            {settings.linkedin_url && <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"><Linkedin size={24} /></a>}
            {settings.email && <a href={`mailto:${settings.email}`} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"><Mail size={24} /></a>}
          </div>
        </section>

        {/* ── SECTION 2: CONTACT ── */}
        <section ref={contactRef} id="contact"
          className="snap-start min-h-[calc(100vh-4rem)] flex items-center px-4 sm:px-6 py-16">
          <div className="max-w-2xl mx-auto w-full">
            <div className="mb-10 text-center">
              <p className="text-indigo-600 dark:text-indigo-400 font-mono text-xs tracking-widest uppercase mb-2">Say Hello</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">Get In Touch</h2>
              <p className="text-gray-500 dark:text-gray-400">Have a project in mind or want to work together?</p>
            </div>

            {sent ? (
              <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl text-center py-16 px-8 shadow-sm">
                <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
                <p className="text-gray-900 dark:text-white font-semibold text-xl mb-2">Message sent!</p>
                <p className="text-gray-500 dark:text-gray-400">I'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={handleContact} className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-8 shadow-sm space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="label">Name</label>
                    <input className="input" value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} required />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input type="email" className="input" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea className="input min-h-[120px] resize-none" value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} required />
                </div>
                <button type="submit" disabled={sending}
                  className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors">
                  <Send size={16} /> {sending ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </section>

      </div>
    </>
  )
}
