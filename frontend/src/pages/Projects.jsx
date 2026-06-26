import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Github, ExternalLink } from 'lucide-react'
import api from '../api/client'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/projects').then(r => { setProjects(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <>
      <Helmet><title>Projects – Portfolio</title></Helmet>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <h1 className="text-4xl font-bold text-white mb-2">Projects</h1>
        <p className="text-gray-400 mb-12">Things I've built and shipped.</p>
        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map(p => (
              <div key={p.id} className="card group">
                {p.image_url && <img src={p.image_url} alt={p.title} className="w-full h-48 object-cover rounded-lg mb-4" />}
                <div className="flex items-start justify-between mb-2">
                  <Link to={`/projects/${p.slug}`} className="font-semibold text-white hover:text-blue-400 transition-colors text-lg">{p.title}</Link>
                  <div className="flex gap-3 ml-3 shrink-0">
                    {p.github_link && <a href={p.github_link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><Github size={18} /></a>}
                    {p.live_url && <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><ExternalLink size={18} /></a>}
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-4">{p.description}</p>
                {p.tags && (
                  <div className="flex flex-wrap gap-2">
                    {p.tags.split(',').map(t => (
                      <span key={t} className="text-xs font-mono text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">{t.trim()}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
