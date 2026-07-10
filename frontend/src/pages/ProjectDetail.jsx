import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Github, ExternalLink, ArrowLeft } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Button, Chip, Spinner } from '@heroui/react'
import api from '../api/client'

const STATUS_COLOR = {
  completed: 'success',
  ongoing: 'primary',
  planned: 'warning',
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/projects/${slug}`).then(r => { setProject(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"><Spinner label="Loading..." color="primary" /></div>
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
            <Chip color={STATUS_COLOR[project.status] || 'default'} variant="flat" size="lg" className="font-medium">
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </Chip>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {project.github_link && (
            <Button as="a" href={project.github_link} target="_blank" rel="noopener noreferrer"
              variant="bordered" radius="lg" size="sm" startContent={<Github size={16} />}>
              GitHub
            </Button>
          )}
          {project.live_url && (
            <Button as="a" href={project.live_url} target="_blank" rel="noopener noreferrer"
              color="primary" radius="lg" size="sm" startContent={<ExternalLink size={16} />}>
              Live Demo
            </Button>
          )}
        </div>

        {project.tags && (
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.split(',').map(t => (
              <Chip key={t} size="sm" variant="flat" color="primary" className="font-mono">{t.trim()}</Chip>
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
