import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Mail, MessageSquare, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/client'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/contact', form)
      setSent(true)
      toast.success('Message sent!')
    } catch {
      toast.error('Failed to send. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet><title>Contact – Portfolio</title></Helmet>
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 mb-4">
            <MessageSquare size={26} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Get In Touch</h1>
          <p className="text-gray-500 dark:text-gray-400">Have a question or want to work together? Send me a message.</p>
        </div>

        {sent ? (
          <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl text-center py-16 px-8 shadow-sm">
            <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
            <p className="text-gray-900 dark:text-white font-semibold text-xl mb-2">Message sent!</p>
            <p className="text-gray-500 dark:text-gray-400">I'll get back to you as soon as possible.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-8 shadow-sm space-y-5">
            <div>
              <label className="label">Name</label>
              <input className="input" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea className="input min-h-[140px] resize-y" placeholder="What's on your mind?" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center inline-flex items-center gap-2">
              <Mail size={16} /> {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </main>
    </>
  )
}
