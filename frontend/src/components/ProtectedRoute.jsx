import { Navigate } from 'react-router-dom'
import { Spinner } from '@heroui/react'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><Spinner color="primary" /></div>
  if (!user) return <Navigate to="/admin/login" replace />
  return children
}
