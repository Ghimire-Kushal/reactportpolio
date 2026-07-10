import { useEffect, useRef, useState } from 'react'
import { Download, Upload, FileJson, CheckCircle2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  Card, CardBody, Chip, Button,
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
} from '@heroui/react'
import api from '../../api/client'

const STATUS_COLOR = {
  completed: 'success',
  ongoing: 'primary',
  planned: 'warning',
  published: 'success',
  draft: 'default',
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
        <Button onPress={exportAll} color="secondary" radius="lg" className="font-medium" startContent={<Download size={16} />}>
          Export All ({projects.length} projects)
        </Button>
      </div>

      {/* Export / Import cards */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Export */}
        <Card radius="lg" shadow="sm">
          <CardBody className="p-6">
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
            <Button onPress={exportAll} color="secondary" radius="lg" size="sm" className="font-medium" startContent={<Download size={15} />}>
              Export All Projects
            </Button>
          </CardBody>
        </Card>

        {/* Import */}
        <Card radius="lg" shadow="sm">
          <CardBody className="p-6">
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
              <Button as="label" variant="bordered" radius="lg" size="sm" className="cursor-pointer"
                startContent={<FileJson size={15} />}>
                {importFile ? importFile.name : 'Choose .json file'}
                <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={e => { setImportFile(e.target.files[0]); setResult(null) }} />
              </Button>
              <Button onPress={handleImport} isDisabled={importing || !importFile} isLoading={importing}
                color="success" radius="lg" size="sm" className="font-medium text-white"
                startContent={!importing && <Upload size={15} />}>
                {importing ? 'Importing...' : 'Import'}
              </Button>
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
          </CardBody>
        </Card>
      </div>

      {/* Individual export table */}
      <Card radius="lg" shadow="sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Export Individual Project</h2>
        </div>
        <Table removeWrapper aria-label="Export individual project">
          <TableHeader>
            <TableColumn>#</TableColumn>
            <TableColumn>TITLE</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>CREATED</TableColumn>
            <TableColumn align="end">EXPORT</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No projects to export.">
            {projects.map((p, i) => (
              <TableRow key={p.id}>
                <TableCell className="text-slate-400">{i + 1}</TableCell>
                <TableCell className="font-medium text-slate-800">{p.title}</TableCell>
                <TableCell>
                  <Chip size="sm" color={STATUS_COLOR[p.status] || 'default'} variant="flat">
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </Chip>
                </TableCell>
                <TableCell className="text-slate-500">
                  {new Date(p.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <Button onPress={() => exportOne(p.id, p.slug)} variant="light" size="sm" className="text-violet-600 font-medium"
                      startContent={<Download size={14} />}>
                      Export
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
