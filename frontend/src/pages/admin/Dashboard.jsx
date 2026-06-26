import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FolderKanban, MessageSquare, Eye } from 'lucide-react'
import api from '../../api/client'

export default function AdminDashboard() {
  const [projects, setProjects] = useState([])
  const [messages, setMessages] = useState([])

  useEffect(() => {
    api.get('/projects/admin/all').then(r => setProjects(r.data)).catch(() => {})
    api.get('/admin/messages').then(r => setMessages(r.data)).catch(() => {})
  }, [])

  const unread = messages.filter(m => !m.read_at).length
  const published = projects.filter(p => p.status === 'published').length

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: FolderKanban, link: '/admin/projects' },
    { label: 'Published', value: published, icon: Eye, link: '/admin/projects' },
    { label: 'Unread Messages', value: unread, icon: MessageSquare, link: '/admin/messages' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {stats.map(s => (
          <Link key={s.label} to={s.link} className="card hover:border-blue-500/50 transition-colors flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg"><s.icon size={20} className="text-blue-400" /></div>
            <div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-gray-400 text-sm">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold text-white mb-4">Recent Messages</h2>
          {messages.slice(0, 5).map(m => (
            <Link key={m.id} to={`/admin/messages/${m.id}`} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0 hover:text-blue-400 transition-colors">
              <div>
                <p className={`text-sm font-medium ${m.read_at ? 'text-gray-400' : 'text-white'}`}>{m.name}</p>
                <p className="text-xs text-gray-500">{m.email}</p>
              </div>
              {!m.read_at && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
            </Link>
          ))}
        </div>
        <div className="card">
          <h2 className="font-semibold text-white mb-4">Recent Projects</h2>
          {projects.slice(0, 5).map(p => (
            <Link key={p.id} to={`/admin/projects/${p.id}/edit`} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0 hover:text-blue-400 transition-colors">
              <p className="text-sm text-gray-300">{p.title}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-gray-700 text-gray-400'}`}>{p.status}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
