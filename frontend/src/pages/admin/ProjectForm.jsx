import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Upload, ImageIcon } from 'lucide-react'
import api from '../../api/client'

const EMPTY = { title: '', description: '', body: '', image_url: '', github_link: '', live_url: '', tags: '', status: 'completed', featured: false }

const STATUS_OPTIONS = [
  { value: 'completed', label: 'Completed' },
  { value: 'ongoing',   label: 'Ongoing' },
  { value: 'planned',   label: 'Planned' },
]

export default function ProjectForm() {
  const { id } = useParams()
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  useEffect(() => {
    if (id) {
      api.get('/projects/admin/all').then(r => {
        const p = r.data.find(x => String(x.id) === id)
        if (p) setForm({ title: p.title, description: p.description || '', body: p.body || '', image_url: p.image_url || '', github_link: p.github_link || '', live_url: p.live_url || '', tags: p.tags || '', status: p.status, featured: p.featured })
      })
    }
  }, [id])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const uploadImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const r = await api.post('/upload', fd)
      set('image_url', r.data.url)
      toast.success('Image uploaded')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isEdit) {
        await api.put(`/projects/admin/${id}`, form)
        toast.success('Project updated')
      } else {
        await api.post('/projects/admin', form)
        toast.success('Project created')
      }
      navigate('/admin/projects')
    } catch {
      toast.error('Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">{isEdit ? 'Edit Project' : 'New Project'}</h1>
      <p className="text-slate-500 mb-8">{isEdit ? 'Update project details.' : 'Fill in the details for your new project.'}</p>

      <form onSubmit={submit} className="space-y-5">
        <div className="admin-card space-y-5">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Basic Info</h2>
          <div>
            <label className="admin-label">Title *</label>
            <input className="admin-input" value={form.title} onChange={e => set('title', e.target.value)} required placeholder="Project name" />
          </div>
          <div>
            <label className="admin-label">Short Description</label>
            <input className="admin-input" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief summary shown on cards" />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="admin-label">Status</label>
              <select className="admin-input" value={form.status} onChange={e => set('status', e.target.value)}>
                {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="admin-label">Tags (comma-separated)</label>
              <input className="admin-input" placeholder="React, Python, FastAPI" value={form.tags} onChange={e => set('tags', e.target.value)} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="admin-label">GitHub URL</label>
              <input className="admin-input" placeholder="https://github.com/..." value={form.github_link} onChange={e => set('github_link', e.target.value)} />
            </div>
            <div>
              <label className="admin-label">Live URL</label>
              <input className="admin-input" placeholder="https://..." value={form.live_url} onChange={e => set('live_url', e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="featured" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="w-4 h-4 rounded accent-violet-600" />
            <label htmlFor="featured" className="text-slate-600 text-sm">Feature on homepage</label>
          </div>
        </div>

        <div className="admin-card space-y-5">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Media</h2>
          <div>
            <label className="admin-label">Project Image</label>
            <div className="flex gap-3 items-start">
              <input className="admin-input flex-1" placeholder="https://... or upload" value={form.image_url} onChange={e => set('image_url', e.target.value)} />
              <label className="admin-btn-secondary cursor-pointer text-sm whitespace-nowrap">
                <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload'}
                <input type="file" accept="image/*" onChange={uploadImage} className="hidden" disabled={uploading} />
              </label>
            </div>
            {form.image_url && <img src={form.image_url} alt="" className="mt-3 h-36 w-full rounded-xl object-cover" />}
            {!form.image_url && (
              <div className="mt-3 h-36 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                <ImageIcon size={32} />
              </div>
            )}
          </div>
        </div>

        <div className="admin-card space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Content</h2>
          <div>
            <label className="admin-label">Body (Markdown)</label>
            <textarea className="admin-input min-h-[220px] resize-y font-mono text-sm" value={form.body} onChange={e => set('body', e.target.value)} placeholder="Write detailed project description in Markdown..." />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="admin-btn-primary">
            {loading ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}
          </button>
          <button type="button" onClick={() => navigate('/admin/projects')} className="admin-btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  )
}
