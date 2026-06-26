import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/client'

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
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        <Link to="/admin/projects/create" className="btn-primary flex items-center gap-2 text-sm"><Plus size={16} /> New Project</Link>
      </div>
      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-800">
            <tr className="text-gray-400 text-left">
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Featured</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50">
                <td className="px-6 py-3 text-white font-medium">{p.title}</td>
                <td className="px-6 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-gray-700 text-gray-400'}`}>{p.status}</span>
                </td>
                <td className="px-6 py-3 text-gray-400">{p.featured ? '⭐' : '—'}</td>
                <td className="px-6 py-3 text-gray-400">{new Date(p.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-3 flex items-center gap-2 justify-end">
                  <Link to={`/admin/projects/${p.id}/edit`} className="text-gray-400 hover:text-white"><Edit size={15} /></Link>
                  <button onClick={() => del(p.id, p.title)} className="text-gray-400 hover:text-red-400"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
