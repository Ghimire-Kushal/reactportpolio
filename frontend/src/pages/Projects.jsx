import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Github, ExternalLink, ArrowRight } from 'lucide-react'
import api from '../api/client'

const STATUS = {
  completed: { label: 'Completed', cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  ongoing:   { label: 'Ongoing',   cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  planned:   { label: 'Planned',   cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
}

const FILTERS = ['all', 'completed', 'ongoing', 'planned']

function ProjectCard({ p }) {
  const status = STATUS[p.status] || { label: p.status, cls: 'bg-gray-100 text-gray-600' }
  return (
    <div className="group flex flex-col bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-gray-200 dark:border-dark-border shadow-sm hover:shadow-xl dark:hover:shadow-gray-900/50 hover:-translate-y-1 transition-all duration-400">
      {/* Image */}
      <div className="overflow-hidden bg-gray-100 dark:bg-dark-muted" style={{ aspectRatio: '16/9' }}>
        {p.image_url
          ? <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          : <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-300 dark:text-gray-600">{p.title[0]}</div>
        }
      </div>

      {/* Content */}
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

        <div className="flex items-center gap-3 flex-wrap">
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

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()
  const cooldown = useRef(false)

  useEffect(() => {
    api.get('/projects').then(r => { setProjects(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  // Scroll up on Home page → back to /  |  Scroll down at bottom → /contact
  useEffect(() => {
    const onWheel = (e) => {
      if (cooldown.current) return
      const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 10
      const atTop = window.scrollY === 0
      if (e.deltaY > 40 && atBottom) {
        cooldown.current = true
        navigate('/contact')
      } else if (e.deltaY < -40 && atTop) {
        cooldown.current = true
        navigate('/')
      }
    }
    let startY = 0
    const onTouchStart = (e) => { startY = e.touches[0].clientY }
    const onTouchEnd = (e) => {
      if (cooldown.current) return
      const diff = startY - e.changedTouches[0].clientY
      const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 10
      const atTop = window.scrollY === 0
      if (diff > 50 && atBottom) { cooldown.current = true; navigate('/contact') }
      if (diff < -50 && atTop) { cooldown.current = true; navigate('/') }
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

  const visible = filter === 'all' ? projects : projects.filter(p => p.status === filter)

  return (
    <>
      <Helmet><title>Projects – Portfolio</title></Helmet>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-20">

        <div className="mb-12">
          <p className="text-indigo-600 dark:text-indigo-400 font-mono text-xs tracking-widest uppercase mb-2">Work</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">All Projects</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Things I've built and shipped.</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-12">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all capitalize border
                ${filter === f
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-400 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}>
              {f === 'all' ? `All (${projects.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${projects.filter(p => p.status === f).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 dark:bg-dark-muted rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visible.map(p => <ProjectCard key={p.id} p={p} />)}
          </div>
        )}

        {!loading && visible.length === 0 && (
          <div className="text-center py-24 text-gray-400 dark:text-gray-600">No projects found.</div>
        )}
      </main>
    </>
  )
}
