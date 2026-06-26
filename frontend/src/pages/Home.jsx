import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Github, Linkedin, Mail, ArrowRight, Download } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import api from '../api/client'

export default function Home() {
  const [settings, setSettings] = useState({})
  const navigate = useNavigate()
  const cooldown = useRef(false)

  useEffect(() => {
    api.get('/settings').then(r => setSettings(r.data)).catch(() => {})
  }, [])

  // Scroll down → /projects
  useEffect(() => {
    const onWheel = (e) => {
      if (e.deltaY > 40 && !cooldown.current) {
        cooldown.current = true
        navigate('/projects')
      }
    }
    let startY = 0
    const onTouchStart = (e) => { startY = e.touches[0].clientY }
    const onTouchEnd = (e) => {
      if (startY - e.changedTouches[0].clientY > 50 && !cooldown.current) {
        cooldown.current = true
        navigate('/projects')
      }
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [navigate])

  const handleResume = () => {
    const a = document.createElement('a')
    a.href = '/api/upload/resume/download'
    a.download = 'Kushal-Ghimire-Resume.pdf'
    a.click()
  }

  return (
    <>
      <Helmet><title>{settings.site_name || 'Kushal Ghimire'} – Portfolio</title></Helmet>

      <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4">
        {/* Pill badge */}
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
          {settings.bio || 'I design and develop high-performance applications with clean architecture, secure authentication systems, and modern UI.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 w-full px-4 sm:px-0 animate-[fadeInUp_0.8s_ease_both]">
          <button onClick={() => navigate('/projects')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40">
            View My Work <ArrowRight size={16} />
          </button>
          <button onClick={handleResume}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-200 font-semibold px-8 py-3.5 rounded-xl border-2 border-gray-300 dark:border-dark-border hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
            <Download size={16} /> Download Resume
          </button>
        </div>

        <div className="flex items-center justify-center gap-7 animate-[fadeInUp_0.9s_ease_both]">
          {settings.github_url && <a href={settings.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"><Github size={24} /></a>}
          {settings.linkedin_url && <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"><Linkedin size={24} /></a>}
          {settings.email && <a href={`mailto:${settings.email}`} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"><Mail size={24} /></a>}
        </div>
      </section>
    </>
  )
}
