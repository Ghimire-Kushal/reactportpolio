import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Github, ExternalLink, ArrowLeft } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import api from '../api/client'

export default function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/projects/${slug}`).then(r => { setProject(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>
  )
  if (!project) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">Project not found.</div>
  )

  return (
    <>
      <Helmet><title>{project.title} – Portfolio</title></Helmet>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <Link to="/projects" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors text-sm">
          <ArrowLeft size={16} /> All Projects
        </Link>

        {project.image_url && (
          <img src={project.image_url} alt={project.title} className="w-full h-72 object-cover rounded-2xl mb-8 shadow-sm" />
        )}

        <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white">{project.title}</h1>
          {project.status && (
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
              project.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' :
              project.status === 'ongoing'   ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' :
              'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
            }`}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {project.github_link && (
            <a href={project.github_link} target="_blank" rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center gap-2 text-sm py-2 px-4">
              <Github size={16} /> GitHub
            </a>
          )}
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2 text-sm py-2 px-4">
              <ExternalLink size={16} /> Live Demo
            </a>
          )}
        </div>

        {project.tags && (
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.split(',').map(t => (
              <span key={t} className="text-xs font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">{t.trim()}</span>
            ))}
          </div>
        )}

        {project.description && !project.body && (
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">{project.description}</p>
        )}

        {project.body && (
          <div className="prose prose-gray dark:prose-invert prose-blue max-w-none">
            <ReactMarkdown>{project.body}</ReactMarkdown>
          </div>
        )}
      </main>
    </>
  )
}
