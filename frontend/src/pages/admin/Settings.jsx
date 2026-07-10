import { useEffect, useRef, useState } from 'react'
import { Upload, User, Globe, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card, CardBody, Input, Textarea, Button, Avatar } from '@heroui/react'
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
      <Card radius="lg" shadow="sm">
        <CardBody className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <User size={17} className="text-violet-500" />
            <h2 className="font-semibold text-slate-700">Profile Photo</h2>
          </div>
          <div className="flex items-center gap-5">
            <Avatar
              src={form.profile_photo || undefined}
              name="K"
              className="w-20 h-20 text-2xl font-bold bg-violet-100 text-violet-400 border-2 border-violet-200"
            />
            <div>
              <Button as="label" variant="bordered" radius="lg" size="sm" className="cursor-pointer"
                isDisabled={uploadingPhoto}
                startContent={<Upload size={14} />}>
                {uploadingPhoto ? 'Uploading...' : 'Change Photo'}
                <input ref={photoRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={uploadPhoto} disabled={uploadingPhoto} />
              </Button>
              <p className="text-slate-400 text-xs mt-2">JPG, PNG, WebP · max 3MB</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Text fields */}
      <Card radius="lg" shadow="sm">
        <CardBody className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Globe size={17} className="text-violet-500" />
            <h2 className="font-semibold text-slate-700">Site Content</h2>
          </div>
          <form onSubmit={submit} className="space-y-4">
            {TEXT_FIELDS.map(f => (
              f.multiline
                ? <Textarea
                    key={f.key}
                    label={f.label}
                    value={form[f.key] || ''}
                    onValueChange={v => setForm(ff => ({ ...ff, [f.key]: v }))}
                    placeholder={f.placeholder}
                    variant="bordered"
                    radius="lg"
                    minRows={3}
                  />
                : <Input
                    key={f.key}
                    label={f.label}
                    value={form[f.key] || ''}
                    onValueChange={v => setForm(ff => ({ ...ff, [f.key]: v }))}
                    placeholder={f.placeholder}
                    variant="bordered"
                    radius="lg"
                  />
            ))}
            <Button type="submit" isLoading={loading} color="secondary" radius="lg" className="font-medium mt-2">
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </CardBody>
      </Card>

      {/* Resume */}
      <Card radius="lg" shadow="sm">
        <CardBody className="p-6">
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
          <Button as="label" variant="bordered" radius="lg" size="sm" className="cursor-pointer"
            isDisabled={uploadingResume}
            startContent={<Upload size={14} />}>
            {uploadingResume ? 'Uploading...' : form.resume ? 'Replace Resume' : 'Upload Resume'}
            <input ref={resumeRef} type="file" accept=".pdf" className="hidden" onChange={uploadResume} disabled={uploadingResume} />
          </Button>
          <p className="text-slate-400 text-xs mt-2">PDF only · max 5MB</p>
        </CardBody>
      </Card>
    </div>
  )
}
