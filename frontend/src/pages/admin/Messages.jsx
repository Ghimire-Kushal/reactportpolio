import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react'
import api from '../../api/client'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])

  const load = () => api.get('/admin/messages').then(r => setMessages(r.data)).catch(() => {})
  useEffect(() => { load() }, [])

  const del = async (id) => {
    if (!confirm('Delete this message?')) return
    await api.delete(`/admin/messages/${id}`)
    toast.success('Deleted')
    load()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Messages</h1>
      <Card className="overflow-hidden" radius="lg" shadow="sm">
        <Table removeWrapper aria-label="Messages">
          <TableHeader>
            <TableColumn>FROM</TableColumn>
            <TableColumn>PREVIEW</TableColumn>
            <TableColumn>DATE</TableColumn>
            <TableColumn> </TableColumn>
          </TableHeader>
          <TableBody emptyContent="No messages yet.">
            {messages.map(m => (
              <TableRow key={m.id}>
                <TableCell>
                  <p className={`font-medium ${m.read_at ? 'text-gray-400' : 'text-white'}`}>{m.name}</p>
                  <p className="text-xs text-gray-500">{m.email}</p>
                </TableCell>
                <TableCell>
                  <Link to={`/admin/messages/${m.id}`} className="text-gray-400 hover:text-white line-clamp-1">{m.message.slice(0, 60)}...</Link>
                </TableCell>
                <TableCell className="text-gray-500 text-xs">{new Date(m.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <button onClick={() => del(m.id)} className="text-gray-400 hover:text-red-400"><Trash2 size={15} /></button>
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
