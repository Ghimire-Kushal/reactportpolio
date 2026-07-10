import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { Card, CardBody, Input, Button } from '@heroui/react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin/dashboard')
    } catch {
      toast.error('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white mb-8 text-center">Admin Login</h1>
        <Card shadow="sm" radius="lg">
          <CardBody className="p-6">
            <form onSubmit={submit} className="space-y-4">
              <Input
                type="email"
                label="Email"
                value={email}
                onValueChange={setEmail}
                isRequired
                autoFocus
                variant="bordered"
                radius="lg"
              />
              <Input
                type="password"
                label="Password"
                value={password}
                onValueChange={setPassword}
                isRequired
                variant="bordered"
                radius="lg"
              />
              <Button type="submit" isLoading={loading} color="primary" radius="lg" className="w-full font-semibold">
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
