import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Upload, ImageIcon } from 'lucide-react'
import { Card, CardBody, Input, Textarea, Select, SelectItem, Checkbox, Button } from '@heroui/react'
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
        <Card radius="lg" shadow="sm">
          <CardBody className="space-y-5 p-6">
            <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Basic Info</h2>
            <Input
              label="Title"
              value={form.title}
              onValueChange={v => set('title', v)}
              isRequired
              placeholder="Project name"
              variant="bordered"
              radius="lg"
            />
            <Input
              label="Short Description"
              value={form.description}
              onValueChange={v => set('description', v)}
              placeholder="Brief summary shown on cards"
              variant="bordered"
              radius="lg"
            />
            <div className="grid sm:grid-cols-2 gap-5">
              <Select
                label="Status"
                selectedKeys={[form.status]}
                onSelectionChange={keys => set('status', Array.from(keys)[0])}
                variant="bordered"
                radius="lg"
              >
                {STATUS_OPTIONS.map(o => <SelectItem key={o.value}>{o.label}</SelectItem>)}
              </Select>
              <Input
                label="Tags (comma-separated)"
                placeholder="React, Python, FastAPI"
                value={form.tags}
                onValueChange={v => set('tags', v)}
                variant="bordered"
                radius="lg"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                label="GitHub URL"
                placeholder="https://github.com/..."
                value={form.github_link}
                onValueChange={v => set('github_link', v)}
                variant="bordered"
                radius="lg"
              />
              <Input
                label="Live URL"
                placeholder="https://..."
                value={form.live_url}
                onValueChange={v => set('live_url', v)}
                variant="bordered"
                radius="lg"
              />
            </div>
            <Checkbox isSelected={form.featured} onValueChange={v => set('featured', v)} color="secondary">
              Feature on homepage
            </Checkbox>
          </CardBody>
        </Card>

        <Card radius="lg" shadow="sm">
          <CardBody className="space-y-5 p-6">
            <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Media</h2>
            <div>
              <label className="admin-label">Project Image</label>
              <div className="flex gap-3 items-start">
                <Input
                  className="flex-1"
                  placeholder="https://... or upload"
                  value={form.image_url}
                  onValueChange={v => set('image_url', v)}
                  variant="bordered"
                  radius="lg"
                />
                <Button as="label" variant="bordered" radius="lg" className="cursor-pointer whitespace-nowrap"
                  isDisabled={uploading}
                  startContent={<Upload size={14} />}>
                  {uploading ? 'Uploading...' : 'Upload'}
                  <input type="file" accept="image/*" onChange={uploadImage} className="hidden" disabled={uploading} />
                </Button>
              </div>
              {form.image_url && <img src={form.image_url} alt="" className="mt-3 h-36 w-full rounded-xl object-cover" />}
              {!form.image_url && (
                <div className="mt-3 h-36 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                  <ImageIcon size={32} />
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        <Card radius="lg" shadow="sm">
          <CardBody className="space-y-4 p-6">
            <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Content</h2>
            <Textarea
              label="Body (Markdown)"
              value={form.body}
              onValueChange={v => set('body', v)}
              placeholder="Write detailed project description in Markdown..."
              variant="bordered"
              radius="lg"
              minRows={9}
              className="font-mono"
            />
          </CardBody>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" isLoading={loading} color="secondary" radius="lg" className="font-medium">
            {loading ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}
          </Button>
          <Button type="button" onPress={() => navigate('/admin/projects')} variant="bordered" radius="lg" className="font-medium">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
