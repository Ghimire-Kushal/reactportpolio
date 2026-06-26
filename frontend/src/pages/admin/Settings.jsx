import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../../api/client'

const FIELDS = [
  { key: 'site_name', label: 'Your Name' },
  { key: 'tagline', label: 'Tagline' },
  { key: 'bio', label: 'Bio', multiline: true },
  { key: 'email', label: 'Contact Email' },
  { key: 'github_url', label: 'GitHub URL' },
  { key: 'linkedin_url', label: 'LinkedIn URL' },
  { key: 'twitter_url', label: 'Twitter/X URL' },
]

export default function AdminSettings() {
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(false)

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

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-8">Site Settings</h1>
      <form onSubmit={submit} className="card space-y-5">
        {FIELDS.map(f => (
          <div key={f.key}>
            <label className="label">{f.label}</label>
            {f.multiline
              ? <textarea className="input min-h-[100px] resize-y" value={form[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
              : <input className="input" value={form[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
            }
          </div>
        ))}
        <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save Settings'}</button>
      </form>
    </div>
  )
}
