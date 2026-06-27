import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FolderOpen, CheckCircle2, Zap, Calendar, Mail, Clock, Plus, List, Globe, Download, Edit, ExternalLink } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/client'

function statusBadge(status) {
  const map = {
    completed: 'bg-green-100 text-green-700',
    ongoing:   'bg-blue-100 text-blue-700',
    planned:   'bg-amber-100 text-amber-700',
    published: 'bg-green-100 text-green-700',
    draft:     'bg-slate-100 text-slate-500',
  }
  return `status-badge ${map[status] || 'bg-slate-100 text-slate-500'}`
}
//push
function daysSince(dateStr) {
  if (!dateStr) return '—'
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [messages, setMessages] = useState([])

  useEffect(() => {
    api.get('/projects/admin/all').then(r => setProjects(r.data)).catch(() => {})
    api.get('/admin/messages').then(r => setMessages(r.data)).catch(() => {})
  }, [])

  const unread = messages.filter(m => !m.read_at).length
  const completed = projects.filter(p => p.status === 'completed').length
  const ongoing   = projects.filter(p => p.status === 'ongoing').length
  const planned   = projects.filter(p => p.status === 'planned').length
  const lastUpdate = projects[0]?.updated_at

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: FolderOpen, color: 'text-violet-500', bg: 'bg-violet-50' },
    { label: 'Completed',      value: completed,        icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Ongoing',        value: ongoing,          icon: Zap,          color: 'text-blue-500',  bg: 'bg-blue-50' },
    { label: 'Planned',        value: planned,          icon: Calendar,     color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Messages',       value: messages.length,  icon: Mail,         color: 'text-orange-500',bg: 'bg-orange-50', badge: unread > 0 ? unread : null },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl p-7 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)' }}>
        <div>
          <p className="text-violet-200 text-sm mb-1">☀ {today}</p>
          <h1 className="text-white text-2xl font-bold mb-1">Welcome back, {user?.name || 'Admin'} 👋</h1>
          <p className="text-violet-200 text-sm">Here's an overview of your portfolio panel.</p>
        </div>
        <Link to="/admin/projects/create" className="bg-white/20 hover:bg-white/30 text-white font-medium px-5 py-2.5 rounded-xl transition flex items-center gap-2 text-sm backdrop-blur shrink-0">
          <Plus size={16} /> New Project
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map(s => (
          <div key={s.label} className="admin-card flex flex-col gap-3">
            <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>
              <s.icon size={20} className={s.color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                {s.value}
                {s.badge && <span className="bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 font-medium">new</span>}
              </p>
              <p className="text-slate-500 text-xs">{s.label}</p>
            </div>
          </div>
        ))}
        {/* Last Update card */}
        <div className="admin-card flex flex-col gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <Clock size={20} className="text-slate-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800">{daysSince(lastUpdate)}</p>
            <p className="text-slate-500 text-xs">Last Update</p>
          </div>
        </div>
      </div>

      {/* Recent Projects + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2 admin-card p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="font-semibold text-slate-800">Recent Projects</h2>
              <p className="text-slate-500 text-xs mt-0.5">Latest 5 portfolio projects</p>
            </div>
            <Link to="/admin/projects" className="text-violet-600 hover:text-violet-700 text-sm font-medium flex items-center gap-1">
              View all <ExternalLink size={13} />
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 text-xs font-medium uppercase tracking-wide border-b border-slate-100">
                <th className="px-6 py-3 text-left">Project</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Added</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.slice(0, 5).map(p => (
                <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      {p.image_url
                        ? <img src={p.image_url} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        : <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                            <FolderOpen size={18} className="text-violet-500" />
                          </div>
                      }
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 truncate max-w-[180px]">{p.title}</p>
                        <p className="text-slate-400 text-xs truncate max-w-[180px]">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className={statusBadge(p.status)}>{p.status.charAt(0).toUpperCase() + p.status.slice(1)}</span>
                  </td>
                  <td className="px-6 py-3 text-slate-500 text-xs">
                    {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/projects/${p.id}/edit`} className="p-1.5 hover:bg-violet-50 rounded text-slate-400 hover:text-violet-600 transition-colors"><Edit size={14} /></Link>
                      <a href={`/projects/${p.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-blue-50 rounded text-slate-400 hover:text-blue-600 transition-colors"><ExternalLink size={14} /></a>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">No projects yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}
        <div className="admin-card">
          <div className="flex items-center gap-2 mb-5">
            <Zap size={17} className="text-violet-500" />
            <h2 className="font-semibold text-slate-800">Quick Actions</h2>
          </div>
          <div className="space-y-2.5">
            <Link to="/admin/projects/create" className="w-full admin-btn-primary justify-center text-sm py-2.5">
              <Plus size={15} /> Add New Project
            </Link>
            <Link to="/admin/projects" className="w-full admin-btn-secondary justify-center text-sm py-2.5">
              <List size={15} /> Manage Projects
            </Link>
            <a href="/" target="_blank" rel="noopener noreferrer" className="w-full admin-btn-secondary justify-center text-sm py-2.5">
              <Globe size={15} /> View Portfolio
            </a>
            <a href="/api/upload/resume/download" target="_blank" rel="noopener noreferrer" className="w-full admin-btn-secondary justify-center text-sm py-2.5">
              <Download size={15} /> Download Resume
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
