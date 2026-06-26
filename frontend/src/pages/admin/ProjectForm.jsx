import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Upload } from 'lucide-react'
import api from '../../api/client'

const EMPTY = { title: '', description: '', body: '', image_url: '', github_link: '', live_url: '', tags: '', status: 'draft', featured: false }

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
      <h1 className="text-2xl font-bold text-white mb-8">{isEdit ? 'Edit Project' : 'New Project'}</h1>
      <form onSubmit={submit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="label">Title *</label>
            <input className="input" value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Short Description</label>
            <input className="input" value={form.description} onChange={e => set('description', e.target.value)} />
          </div>
          <div>
            <label className="label">GitHub URL</label>
            <input className="input" value={form.github_link} onChange={e => set('github_link', e.target.value)} />
          </div>
          <div>
            <label className="label">Live URL</label>
            <input className="input" value={form.live_url} onChange={e => set('live_url', e.target.value)} />
          </div>
          <div>
            <label className="label">Tags (comma-separated)</label>
            <input className="input" placeholder="React, Python, FastAPI" value={form.tags} onChange={e => set('tags', e.target.value)} />
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label">Image</label>
            <div className="flex gap-3 items-start">
              <input className="input flex-1" placeholder="https://..." value={form.image_url} onChange={e => set('image_url', e.target.value)} />
              <label className="btn-secondary cursor-pointer flex items-center gap-2 text-sm whitespace-nowrap">
                <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload'}
                <input type="file" accept="image/*" onChange={uploadImage} className="hidden" disabled={uploading} />
              </label>
            </div>
            {form.image_url && <img src={form.image_url} alt="" className="mt-2 h-24 rounded-lg object-cover" />}
          </div>
          <div className="sm:col-span-2">
            <label className="label">Body (Markdown)</label>
            <textarea className="input min-h-[200px] resize-y font-mono text-sm" value={form.body} onChange={e => set('body', e.target.value)} />
          </div>
          <div className="sm:col-span-2 flex items-center gap-3">
            <input type="checkbox" id="featured" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="w-4 h-4 rounded" />
            <label htmlFor="featured" className="text-gray-300 text-sm">Feature on homepage</label>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}</button>
          <button type="button" onClick={() => navigate('/admin/projects')} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  )
}
