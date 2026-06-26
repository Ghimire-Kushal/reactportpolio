import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FolderKanban, MessageSquare, Settings, LogOut, ExternalLink, Mail, Archive } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useEffect, useState } from 'react'
import api from '../../api/client'

const navMain = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/projects', icon: FolderKanban, label: 'Projects' },
]
const navWebsite = [
  { to: '/', icon: ExternalLink, label: 'View Website', external: true },
  { to: '/admin/messages', icon: MessageSquare, label: 'Contact' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
  { to: '/admin/backup', icon: Archive, label: 'Backup' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    api.get('/admin/messages').then(r => {
      setUnread(r.data.filter(m => !m.read_at).length)
    }).catch(() => {})
  }, [])

  const handleLogout = () => { logout(); navigate('/admin/login') }

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'A'

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-60 flex flex-col" style={{ background: 'linear-gradient(180deg, #1e0938 0%, #2d1054 100%)' }}>
        {/* Brand */}
        <div className="px-5 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-violet-500 flex items-center justify-center text-white font-bold text-sm">K</div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Kushal.dev</p>
              <p className="text-violet-300 text-xs">ADMIN PANEL</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-6">
          <div>
            <p className="text-violet-400 text-xs font-semibold uppercase tracking-wider px-3 mb-2">MAIN</p>
            <div className="space-y-0.5">
              {navMain.map(({ to, icon: Icon, label }) => (
                <NavLink key={to} to={to} className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive
                    ? 'bg-violet-600 text-white font-medium'
                    : 'text-violet-200 hover:bg-white/10 hover:text-white'}`
                }>
                  <Icon size={17} />{label}
                </NavLink>
              ))}
            </div>
          </div>

          <div>
            <p className="text-violet-400 text-xs font-semibold uppercase tracking-wider px-3 mb-2">WEBSITE</p>
            <div className="space-y-0.5">
              {navWebsite.map(({ to, icon: Icon, label, external }) => (
                external ? (
                  <a key={to} href={to} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-violet-200 hover:bg-white/10 hover:text-white transition-all">
                    <Icon size={17} />{label}
                  </a>
                ) : (
                  <NavLink key={to} to={to} className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive
                      ? 'bg-violet-600 text-white font-medium'
                      : 'text-violet-200 hover:bg-white/10 hover:text-white'}`
                  }>
                    <Icon size={17} />
                    <span className="flex-1">{label}</span>
                    {label === 'Contact' && unread > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">{unread}</span>
                    )}
                  </NavLink>
                )
              ))}
            </div>
          </div>
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-9 h-9 rounded-full bg-violet-500 flex items-center justify-center text-white text-sm font-semibold shrink-0">{initials}</div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.name || 'Admin'}</p>
              <p className="text-violet-300 text-xs">Administrator</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-violet-200 hover:bg-white/10 hover:text-white text-sm transition-all">
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-sm font-semibold">{initials}</div>
            <span className="text-slate-700 text-sm font-medium">{user?.name || 'Admin'}</span>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
