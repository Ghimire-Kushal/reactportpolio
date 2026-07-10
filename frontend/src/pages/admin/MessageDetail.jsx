import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MailOpen, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card, CardBody, Button, Spinner } from '@heroui/react'
import api from '../../api/client'

export default function MessageDetail() {
  const { id } = useParams()
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    api.get(`/admin/messages/${id}`).then(r => setMsg(r.data)).catch(() => {})
  }, [id])

  const toggle = async () => {
    const endpoint = msg.read_at ? 'unread' : 'read'
    const r = await api.patch(`/admin/messages/${id}/${endpoint}`)
    setMsg(r.data)
    toast.success(msg.read_at ? 'Marked unread' : 'Marked read')
  }

  if (!msg) return <div className="flex items-center gap-2 text-gray-400"><Spinner size="sm" /> Loading...</div>

  return (
    <div className="max-w-2xl">
      <Link to="/admin/messages" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 text-sm"><ArrowLeft size={14} /> All Messages</Link>
      <Card radius="lg" shadow="sm">
        <CardBody className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">{msg.name}</h2>
              <a href={`mailto:${msg.email}`} className="text-blue-400 text-sm hover:underline">{msg.email}</a>
            </div>
            <Button
              onPress={toggle}
              variant="light"
              size="sm"
              className="text-gray-400 hover:text-white"
              startContent={msg.read_at ? <Mail size={15} /> : <MailOpen size={15} />}
            >
              {msg.read_at ? 'Mark Unread' : 'Mark Read'}
            </Button>
          </div>
          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
          <p className="text-gray-600 text-xs mt-6">{new Date(msg.created_at).toLocaleString()}</p>
        </CardBody>
      </Card>
    </div>
  )
}
