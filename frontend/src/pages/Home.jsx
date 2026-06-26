import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Github, Linkedin, Mail, ArrowRight, ExternalLink } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import api from '../api/client'

export default function Home() {
  const [settings, setSettings] = useState({})
  const [projects, setProjects] = useState([])

  useEffect(() => {
    api.get('/settings').then(r => setSettings(r.data)).catch(() => {})
    api.get('/projects?featured=true').then(r => setProjects(r.data.slice(0, 3))).catch(() => {})
  }, [])

  return (
    <>
      <Helmet><title>{settings.site_name || 'Kushal Ghimire'} – Portfolio</title></Helmet>
      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <section className="min-h-[85vh] flex flex-col justify-center py-20">
          <p className="text-blue-400 font-mono mb-4">Hi, my name is</p>
          <h1 className="text-5xl sm:text-7xl font-bold text-white mb-4">{settings.site_name || 'Kushal Ghimire'}</h1>
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-400 mb-6">{settings.tagline || 'I build things for the web.'}</h2>
          <p className="text-gray-400 text-lg max-w-2xl mb-10 leading-relaxed">{settings.bio || 'A passionate full-stack developer building modern web experiences.'}</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/projects" className="btn-primary flex items-center gap-2">View Projects <ArrowRight size={16} /></Link>
            <Link to="/contact" className="btn-secondary">Get In Touch</Link>
          </div>
          <div className="flex items-center gap-6 mt-12">
            {settings.github_url && <a href={settings.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><Github size={22} /></a>}
            {settings.linkedin_url && <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><Linkedin size={22} /></a>}
            {settings.email && <a href={`mailto:${settings.email}`} className="text-gray-400 hover:text-white transition-colors"><Mail size={22} /></a>}
          </div>
        </section>

        {/* Featured Projects */}
        {projects.length > 0 && (
          <section className="py-20">
            <h2 className="text-2xl font-bold text-white mb-2">Featured Projects</h2>
            <p className="text-gray-400 mb-10">Some things I've built.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(p => (
                <Link key={p.id} to={`/projects/${p.slug}`} className="card hover:border-blue-500/50 transition-colors group">
                  {p.image_url && <img src={p.image_url} alt={p.title} className="w-full h-40 object-cover rounded-lg mb-4" />}
                  <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors mb-2">{p.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{p.description}</p>
                  {p.tags && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {p.tags.split(',').slice(0, 4).map(t => (
                        <span key={t} className="text-xs font-mono text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">{t.trim()}</span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link to="/projects" className="btn-secondary inline-flex items-center gap-2">View All Projects <ArrowRight size={16} /></Link>
            </div>
          </section>
        )}
      </main>
    </>
  )
}
