import { useEffect, useRef, useState } from 'react'
import { Download, Upload, FileJson, CheckCircle2, AlertCircle } from 'lucide-react'
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

export default function AdminBackup() {
  const [projects, setProjects] = useState([])
  const [importing, setImporting] = useState(false)
  const [importFile, setImportFile] = useState(null)
  const [result, setResult] = useState(null)
  const fileRef = useRef()

  const load = () => api.get('/projects/admin/all').then(r => setProjects(r.data)).catch(() => {})
  useEffect(() => { load() }, [])

  const exportAll = async () => {
    try {
      const r = await api.get('/backup/export')
      const blob = new Blob([JSON.stringify(r.data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'portfolio-backup.json'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Backup exported')
    } catch {
      toast.error('Export failed')
    }
  }

  const exportOne = async (id, slug) => {
    try {
      const r = await api.get(`/backup/export/${id}`)
      const blob = new Blob([JSON.stringify(r.data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${slug}-backup.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Export failed')
    }
  }

  const handleImport = async () => {
    if (!importFile) { toast.error('Select a JSON file first'); return }
    setImporting(true)
    setResult(null)
    const fd = new FormData()
    fd.append('file', importFile)
    try {
      const r = await api.post('/backup/import', fd)
      setResult(r.data)
      toast.success(`Imported ${r.data.imported} project(s)`)
      load()
    } catch {
      toast.error('Import failed')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Backup &amp; Restore</h1>
          <p className="text-slate-500 mt-1">Export your projects as JSON. Import them on any new deployment.</p>
        </div>
        <button onClick={exportAll} className="admin-btn-primary">
          <Download size={16} /> Export All ({projects.length} projects)
        </button>
      </div>

      {/* Export / Import cards */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Export */}
        <div className="admin-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
              <Download size={20} className="text-violet-500" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800">Export Projects</h2>
              <p className="text-slate-500 text-xs">Download a JSON backup file</p>
            </div>
          </div>
          <p className="text-slate-500 text-sm mb-5 leading-relaxed">
            The exported JSON file contains all project data (title, description, links, status).
            Store it safely — use it to restore on any new server.
          </p>
          <button onClick={exportAll} className="admin-btn-primary text-sm">
            <Download size={15} /> Export All Projects
          </button>
        </div>

        {/* Import */}
        <div className="admin-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Upload size={20} className="text-emerald-500" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800">Import Projects</h2>
              <p className="text-slate-500 text-xs">Restore from a JSON backup file</p>
            </div>
          </div>
          <p className="text-slate-500 text-sm mb-5 leading-relaxed">
            Upload a previously exported JSON backup. Projects that already exist (by title) will be skipped automatically.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <label className="admin-btn-secondary text-sm cursor-pointer">
              <FileJson size={15} />
              {importFile ? importFile.name : 'Choose .json file'}
              <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={e => { setImportFile(e.target.files[0]); setResult(null) }} />
            </label>
            <button onClick={handleImport} disabled={importing || !importFile} className="admin-btn-green text-sm">
              <Upload size={15} /> {importing ? 'Importing...' : 'Import'}
            </button>
          </div>

          {result && (
            <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm">
              <div className="flex items-center gap-2 text-green-700 mb-1">
                <CheckCircle2 size={14} /> {result.imported} project(s) imported
              </div>
              {result.skipped > 0 && <p className="text-slate-500">{result.skipped} skipped (duplicates)</p>}
              {result.errors?.map((e, i) => (
                <div key={i} className="flex items-center gap-1.5 text-red-500 mt-1"><AlertCircle size={12} />{e}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Individual export table */}
      <div className="admin-card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Export Individual Project</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 text-xs font-medium uppercase tracking-wide border-b border-slate-100">
              <th className="px-6 py-3 text-left w-10">#</th>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Created</th>
              <th className="px-6 py-3 text-right">Export</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p, i) => (
              <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3 text-slate-400">{i + 1}</td>
                <td className="px-6 py-3 font-medium text-slate-800">{p.title}</td>
                <td className="px-6 py-3">
                  <span className={statusBadge(p.status)}>{p.status.charAt(0).toUpperCase() + p.status.slice(1)}</span>
                </td>
                <td className="px-6 py-3 text-slate-500">
                  {new Date(p.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-6 py-3 text-right">
                  <button onClick={() => exportOne(p.id, p.slug)} className="text-violet-600 hover:text-violet-800 text-sm font-medium flex items-center gap-1.5 ml-auto">
                    <Download size={14} /> Export
                  </button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">No projects to export.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
