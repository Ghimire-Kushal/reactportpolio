import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Contact from './pages/Contact'
import AdminLogin from './pages/admin/Login'
import AdminLayout from './pages/admin/Layout'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProjects from './pages/admin/Projects'
import AdminProjectForm from './pages/admin/ProjectForm'
import AdminMessages from './pages/admin/Messages'
import AdminMessageDetail from './pages/admin/MessageDetail'
import AdminSettings from './pages/admin/Settings'
import AdminBackup from './pages/admin/Backup'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
        <Route path="/projects" element={<><Navbar /><Projects /><Footer /></>} />
        <Route path="/projects/:slug" element={<><Navbar /><ProjectDetail /><Footer /></>} />
        <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />

        {/* Admin auth */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin protected */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="projects/create" element={<AdminProjectForm />} />
          <Route path="projects/:id/edit" element={<AdminProjectForm />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="messages/:id" element={<AdminMessageDetail />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="backup" element={<AdminBackup />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
