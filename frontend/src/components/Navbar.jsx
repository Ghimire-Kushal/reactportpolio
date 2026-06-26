import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const links = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="font-mono font-semibold text-blue-400 text-lg">KG.</Link>
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => isActive ? 'text-blue-400 font-medium' : 'text-gray-400 hover:text-white transition-colors'}>
              {l.label}
            </NavLink>
          ))}
          <a href="/api/resume" download className="btn-primary text-sm py-2 px-4">Resume</a>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden text-gray-400 hover:text-white">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-gray-800 px-4 py-3 space-y-2 bg-gray-950">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setOpen(false)} className={({ isActive }) => `block py-2 ${isActive ? 'text-blue-400' : 'text-gray-400'}`}>
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}
