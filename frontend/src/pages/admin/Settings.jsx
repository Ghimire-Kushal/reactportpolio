import { useEffect, useRef, useState } from 'react'
import { Upload, User, Globe, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/client'

const TEXT_FIELDS = [
  { key: 'site_name',      label: 'Your Name',       placeholder: 'Kushal Ghimire' },
  { key: 'hero_title',     label: 'Hero Title',       placeholder: 'Full Stack Developer' },
  { key: 'hero_subtitle',  label: 'Hero Subtitle',    placeholder: 'Building modern web experiences...' },
  { key: 'tagline',        label: 'Tagline',          placeholder: 'I build things for the web.' },
  { key: 'bio',            label: 'Bio',              placeholder: 'A few sentences about yourself...', multiline: true },
  { key: 'email',          label: 'Contact Email',    placeholder: 'you@email.com' },
  { key: 'github_url',     label: 'GitHub URL',       placeholder: 'https://github.com/...' },
  { key: 'linkedin_url',   label: 'LinkedIn URL',     placeholder: 'https://linkedin.com/in/...' },
  { key: 'twitter_url',    label: 'Twitter/X URL',    placeholder: 'https://x.com/...' },
]

export default function AdminSettings() {
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [uploadingResume, setUploadingResume] = useState(false)
  const photoRef = useRef()
  const resumeRef = useRef()

  useEffect(() => {
    api.get('/settings').then(r => setForm(r.data)).catch(() => {})
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/settings', { settings: form })
      toast.success('Settings saved')
    } catch {
      toast.error('Failed to save')
    } finally {
      setLoading(false)
    }
  }

  const uploadPhoto = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingPhoto(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const r = await api.post('/upload', fd)
      setForm(f => ({ ...f, profile_photo: r.data.url }))
      await api.post('/settings', { settings: { profile_photo: r.data.url } })
      toast.success('Profile photo updated')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploadingPhoto(false)
    }
  }

  const uploadResume = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingResume(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const r = await api.post('/upload/resume', fd)
      setForm(f => ({ ...f, resume: r.data.url }))
      await api.post('/settings', { settings: { resume: r.data.url } })
      toast.success('Resume uploaded')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploadingResume(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Site Settings</h1>
        <p className="text-slate-500 mt-1">Manage your portfolio content and profile.</p>
      </div>

      {/* Profile photo */}
      <div className="admin-card">
        <div className="flex items-center gap-2 mb-5">
          <User size={17} className="text-violet-500" />
          <h2 className="font-semibold text-slate-700">Profile Photo</h2>
        </div>
        <div className="flex items-center gap-5">
          {form.profile_photo
            ? <img src={form.profile_photo} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-violet-200" />
            : <div className="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center text-violet-400 text-2xl font-bold">K</div>
          }
          <div>
            <label className="admin-btn-secondary text-sm cursor-pointer">
              <Upload size={14} /> {uploadingPhoto ? 'Uploading...' : 'Change Photo'}
              <input ref={photoRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={uploadPhoto} disabled={uploadingPhoto} />
            </label>
            <p className="text-slate-400 text-xs mt-2">JPG, PNG, WebP · max 3MB</p>
          </div>
        </div>
      </div>

      {/* Text fields */}
      <div className="admin-card">
        <div className="flex items-center gap-2 mb-5">
          <Globe size={17} className="text-violet-500" />
          <h2 className="font-semibold text-slate-700">Site Content</h2>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {TEXT_FIELDS.map(f => (
            <div key={f.key}>
              <label className="admin-label">{f.label}</label>
              {f.multiline
                ? <textarea className="admin-input min-h-[90px] resize-y" value={form[f.key] || ''} onChange={e => setForm(ff => ({ ...ff, [f.key]: e.target.value }))} placeholder={f.placeholder} />
                : <input className="admin-input" value={form[f.key] || ''} onChange={e => setForm(ff => ({ ...ff, [f.key]: e.target.value }))} placeholder={f.placeholder} />
              }
            </div>
          ))}
          <button type="submit" disabled={loading} className="admin-btn-primary mt-2">
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>

      {/* Resume */}
      <div className="admin-card">
        <div className="flex items-center gap-2 mb-5">
          <FileText size={17} className="text-violet-500" />
          <h2 className="font-semibold text-slate-700">Resume</h2>
        </div>
        {form.resume && (
          <div className="mb-4 flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <FileText size={18} className="text-violet-500 shrink-0" />
            <p className="text-slate-600 text-sm flex-1 truncate">Resume uploaded</p>
            <a href={form.resume} target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline text-sm font-medium">Download</a>
          </div>
        )}
        <label className="admin-btn-secondary text-sm cursor-pointer">
          <Upload size={14} /> {uploadingResume ? 'Uploading...' : form.resume ? 'Replace Resume' : 'Upload Resume'}
          <input ref={resumeRef} type="file" accept=".pdf" className="hidden" onChange={uploadResume} disabled={uploadingResume} />
        </label>
        <p className="text-slate-400 text-xs mt-2">PDF only · max 5MB</p>
      </div>
    </div>
  )
}
