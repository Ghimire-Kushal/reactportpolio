import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Github, Linkedin, Mail, ArrowRight, ExternalLink, Download } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import api from '../api/client'

const STATUS = {
  completed: { label: 'Completed', cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  ongoing:   { label: 'Ongoing',   cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  planned:   { label: 'Planned',   cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
}

function useInView(threshold = 0.1) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

function ProjectCard({ p, delay = 0 }) {
  const [ref, visible] = useInView()
  const status = STATUS[p.status] || { label: p.status, cls: 'bg-gray-100 text-gray-600' }

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`group flex flex-col bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-gray-200 dark:border-dark-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="overflow-hidden bg-gray-100 dark:bg-dark-muted" style={{ aspectRatio: '16/9' }}>
        {p.image_url
          ? <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          : <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-300 dark:text-gray-600">{p.title[0]}</div>
        }
      </div>

      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-bold text-xl text-gray-900 dark:text-white leading-snug">{p.title}</h3>
          <span className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full ${status.cls}`}>
            {status.label}
          </span>
        </div>

        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
          {p.description}
        </p>

        {p.tags && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {p.tags.split(',').slice(0, 4).map(t => (
              <span key={t} className="text-xs font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 px-2 py-0.5 rounded-md">
                {t.trim()}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4">
          {p.live_url && (
            <a href={p.live_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              <ExternalLink size={13} /> Live Demo
            </a>
          )}
          <Link to={`/projects/${p.slug}`}
            className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-medium transition-colors">
            Details <ArrowRight size={14} />
          </Link>
          {p.github_link && (
            <a href={p.github_link} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors ml-auto">
              <Github size={14} /> GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [settings, setSettings] = useState({})
  const [projects, setProjects] = useState([])
  const [sectionRef, sectionVisible] = useInView(0.05)
  const projectsRef = useRef(null)

  useEffect(() => {
    api.get('/settings').then(r => setSettings(r.data)).catch(() => {})
    api.get('/projects').then(r => setProjects(r.data.slice(0, 3))).catch(() => {})
  }, [])

  const handleResume = () => {
    const a = document.createElement('a')
    a.href = '/api/upload/resume/download'
    a.download = 'Kushal-Ghimire-Resume.pdf'
    a.click()
  }

  return (
    <>
      <Helmet><title>{settings.site_name || 'Kushal Ghimire'} – Portfolio</title></Helmet>

      {/* ── Hero ── */}
      <section className="min-h-[92vh] flex flex-col items-center justify-center text-center px-4">

        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-dark-muted border border-gray-200 dark:border-dark-border rounded-full px-5 py-2 text-sm text-gray-700 dark:text-gray-300 mb-8 animate-[fadeInUp_0.4s_ease_both]">
          🚀 {settings.hero_subtitle || 'Building Scalable Web Applications'}
        </div>

        {/* Name */}
        <h1 className="text-6xl sm:text-8xl font-extrabold text-gray-900 dark:text-white mb-5 tracking-tight animate-[fadeInUp_0.5s_ease_both]">
          {settings.site_name || 'Kushal Ghimire'}
        </h1>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-6 animate-[fadeInUp_0.6s_ease_both]">
          {settings.hero_title || 'Frontend Developer · Backend Specialist · Vibe Coder'}
        </p>

        {/* Bio */}
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl leading-relaxed mb-10 animate-[fadeInUp_0.7s_ease_both]">
          {settings.bio || 'I design and develop high-performance applications with clean architecture, secure authentication systems, and modern UI.'}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12 animate-[fadeInUp_0.8s_ease_both]">
          <button
            onClick={() => projectsRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40"
          >
            View My Work <ArrowRight size={16} />
          </button>
          <button
            onClick={handleResume}
            className="inline-flex items-center gap-2 bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-200 font-semibold px-8 py-3.5 rounded-xl border-2 border-gray-300 dark:border-dark-border hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
          >
            <Download size={16} /> Download Resume
          </button>
        </div>

        {/* Social links */}
        <div className="flex items-center justify-center gap-7 animate-[fadeInUp_0.9s_ease_both]">
          {settings.github_url && (
            <a href={settings.github_url} target="_blank" rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
              <Github size={24} />
            </a>
          )}
          {settings.linkedin_url && (
            <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
              <Linkedin size={24} />
            </a>
          )}
          {settings.email && (
            <a href={`mailto:${settings.email}`}
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
              <Mail size={24} />
            </a>
          )}
        </div>
      </section>

      {/* ── Featured Projects ── */}
      <section ref={sectionRef} className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <div ref={projectsRef} className={`mb-14 transition-all duration-700 ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-indigo-600 dark:text-indigo-400 font-mono text-xs tracking-widest uppercase mb-2">Portfolio</p>
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">Featured Projects</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Real-world applications I've built</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} p={p} delay={i * 120} />
          ))}
        </div>

        {projects.length > 0 && (
          <div className={`mt-12 flex justify-center transition-all duration-700 delay-300 ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link to="/projects"
              className="inline-flex items-center gap-2 bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold px-8 py-3 rounded-xl border border-gray-300 dark:border-dark-border transition-colors shadow-sm">
              View All Projects <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>
    </>
  )
}
