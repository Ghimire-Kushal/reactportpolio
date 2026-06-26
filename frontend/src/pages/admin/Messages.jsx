import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
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
      <div className="card overflow-hidden p-0">
        {messages.length === 0 ? (
          <p className="text-gray-400 p-6">No messages yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-800">
              <tr className="text-gray-400 text-left">
                <th className="px-6 py-3">From</th>
                <th className="px-6 py-3">Preview</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {messages.map(m => (
                <tr key={m.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50">
                  <td className="px-6 py-3">
                    <p className={`font-medium ${m.read_at ? 'text-gray-400' : 'text-white'}`}>{m.name}</p>
                    <p className="text-xs text-gray-500">{m.email}</p>
                  </td>
                  <td className="px-6 py-3">
                    <Link to={`/admin/messages/${m.id}`} className="text-gray-400 hover:text-white line-clamp-1">{m.message.slice(0, 60)}...</Link>
                  </td>
                  <td className="px-6 py-3 text-gray-500 text-xs">{new Date(m.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-3 flex justify-end">
                    <button onClick={() => del(m.id)} className="text-gray-400 hover:text-red-400"><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
