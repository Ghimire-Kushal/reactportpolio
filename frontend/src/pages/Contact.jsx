import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Mail, MessageSquare, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card, CardBody, Input, Textarea, Button } from '@heroui/react'
import api from '../api/client'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const navigate = useNavigate()
  const cooldown = useRef(false)

  // Scroll up → back to /projects
  useEffect(() => {
    const onWheel = (e) => {
      if (cooldown.current) return
      if (e.deltaY < -40 && window.scrollY === 0) {
        cooldown.current = true
        navigate('/projects')
      }
    }
    let startY = 0
    const onTouchStart = (e) => { startY = e.touches[0].clientY }
    const onTouchEnd = (e) => {
      if (cooldown.current) return
      if (e.changedTouches[0].clientY - startY > 50 && window.scrollY === 0) {
        cooldown.current = true
        navigate('/projects')
      }
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [navigate])

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
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">Get In Touch</h1>
          <p className="text-gray-500 dark:text-gray-400">Have a question or want to work together? Send me a message.</p>
        </div>

        {sent ? (
          <Card shadow="sm" radius="lg" className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border">
            <CardBody className="text-center py-16 px-8">
              <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
              <p className="text-gray-900 dark:text-white font-semibold text-xl mb-2">Message sent!</p>
              <p className="text-gray-500 dark:text-gray-400">I'll get back to you as soon as possible.</p>
            </CardBody>
          </Card>
        ) : (
          <Card shadow="sm" radius="lg" className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border">
            <CardBody className="p-8">
              <form onSubmit={submit} className="space-y-5">
                <Input
                  label="Name"
                  value={form.name}
                  onValueChange={v => setForm({ ...form, name: v })}
                  isRequired
                  variant="bordered"
                  radius="lg"
                />
                <Input
                  type="email"
                  label="Email"
                  value={form.email}
                  onValueChange={v => setForm({ ...form, email: v })}
                  isRequired
                  variant="bordered"
                  radius="lg"
                />
                <Textarea
                  label="Message"
                  value={form.message}
                  onValueChange={v => setForm({ ...form, message: v })}
                  isRequired
                  variant="bordered"
                  radius="lg"
                  minRows={5}
                />
                <Button
                  type="submit"
                  isLoading={loading}
                  color="primary"
                  radius="lg"
                  size="lg"
                  className="w-full font-semibold"
                  startContent={!loading && <Mail size={16} />}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardBody>
          </Card>
        )}
      </main>
    </>
  )
}
