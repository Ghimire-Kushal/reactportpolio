import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, ExternalLink, FolderOpen } from 'lucide-react'
import toast from 'react-hot-toast'
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

export default function AdminProjects() {
  const [projects, setProjects] = useState([])

  const load = () => api.get('/projects/admin/all').then(r => setProjects(r.data)).catch(() => {})
  useEffect(() => { load() }, [])

  const del = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return
    await api.delete(`/projects/admin/${id}`)
    toast.success('Deleted')
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Projects</h1>
          <p className="text-slate-500 mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link to="/admin/projects/create" className="admin-btn-primary text-sm">
          <Plus size={16} /> New Project
        </Link>
      </div>

      <div className="admin-card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 text-xs font-medium uppercase tracking-wide border-b border-slate-100">
              <th className="px-6 py-3 text-left">Project</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Featured</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    {p.image_url
                      ? <img src={p.image_url} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      : <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                          <FolderOpen size={18} className="text-violet-400" />
                        </div>
                    }
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 truncate max-w-[220px]">{p.title}</p>
                      <p className="text-slate-400 text-xs truncate max-w-[220px]">{p.description?.slice(0, 50)}{p.description?.length > 50 ? '...' : ''}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3">
                  <span className={statusBadge(p.status)}>{p.status.charAt(0).toUpperCase() + p.status.slice(1)}</span>
                </td>
                <td className="px-6 py-3 text-slate-400 text-center">{p.featured ? '⭐' : '—'}</td>
                <td className="px-6 py-3 text-slate-500 text-xs">
                  {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-1.5 justify-end">
                    <Link to={`/admin/projects/${p.id}/edit`} className="p-1.5 hover:bg-violet-50 rounded text-slate-400 hover:text-violet-600 transition-colors" title="Edit">
                      <Edit size={15} />
                    </Link>
                    <a href={`/projects/${p.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-blue-50 rounded text-slate-400 hover:text-blue-600 transition-colors" title="View">
                      <ExternalLink size={15} />
                    </a>
                    <button onClick={() => del(p.id, p.title)} className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400">No projects yet. <Link to="/admin/projects/create" className="text-violet-600 hover:underline">Create one.</Link></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
