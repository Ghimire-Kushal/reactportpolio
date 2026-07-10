import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, ExternalLink, FolderOpen } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  Card, Chip, Button,
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure,
} from '@heroui/react'
import api from '../../api/client'

const STATUS_COLOR = {
  completed: 'success',
  ongoing: 'primary',
  planned: 'warning',
  published: 'success',
  draft: 'default',
}

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [target, setTarget] = useState(null)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const load = () => api.get('/projects/admin/all').then(r => setProjects(r.data)).catch(() => {})
  useEffect(() => { load() }, [])

  const askDelete = (id, title) => {
    setTarget({ id, title })
    onOpen()
  }

  const confirmDelete = async (close) => {
    if (!target) return
    await api.delete(`/projects/admin/${target.id}`)
    toast.success('Deleted')
    setTarget(null)
    close()
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Projects</h1>
          <p className="text-slate-500 mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
        </div>
        <Button as={Link} to="/admin/projects/create" color="primary" radius="lg" size="sm" className="font-medium"
          startContent={<Plus size={16} />}>
          New Project
        </Button>
      </div>

      <Card radius="lg" shadow="sm">
        <Table removeWrapper aria-label="Projects">
          <TableHeader>
            <TableColumn>PROJECT</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>FEATURED</TableColumn>
            <TableColumn>DATE</TableColumn>
            <TableColumn align="end">ACTIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent={
            <span>No projects yet. <Link to="/admin/projects/create" className="text-violet-600 hover:underline">Create one.</Link></span>
          }>
            {projects.map(p => (
              <TableRow key={p.id}>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <Chip size="sm" color={STATUS_COLOR[p.status] || 'default'} variant="flat">
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </Chip>
                </TableCell>
                <TableCell className="text-slate-400 text-center">{p.featured ? '⭐' : '—'}</TableCell>
                <TableCell className="text-slate-500 text-xs">
                  {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 justify-end">
                    <Link to={`/admin/projects/${p.id}/edit`} className="p-1.5 hover:bg-violet-50 rounded text-slate-400 hover:text-violet-600 transition-colors" title="Edit">
                      <Edit size={15} />
                    </Link>
                    <a href={`/projects/${p.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-blue-50 rounded text-slate-400 hover:text-blue-600 transition-colors" title="View">
                      <ExternalLink size={15} />
                    </a>
                    <button onClick={() => askDelete(p.id, p.title)} className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(close) => (
            <>
              <ModalHeader>Delete project</ModalHeader>
              <ModalBody>
                <p className="text-slate-600">Are you sure you want to delete "{target?.title}"? This can't be undone.</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={close}>Cancel</Button>
                <Button color="danger" onPress={() => confirmDelete(close)}>Delete</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
