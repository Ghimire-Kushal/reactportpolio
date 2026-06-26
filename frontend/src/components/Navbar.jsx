import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { dark, toggle } = useTheme()

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-[#0d0e1af2] backdrop-blur-md border-b border-gray-200 dark:border-dark-border transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        <Link to="/" className="font-bold text-blue-600 dark:text-blue-400 text-xl tracking-tight">
          Kushal.dev
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              className={({ isActive }) => isActive
                ? 'text-blue-600 dark:text-blue-400 font-medium text-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm'
              }>
              {l.label}
            </NavLink>
          ))}

          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-dark-muted hover:bg-gray-200 dark:hover:bg-dark-muted text-gray-600 dark:text-gray-300 transition-all duration-200"
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-dark-muted text-gray-600 dark:text-gray-300 transition-all duration-200"
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button onClick={() => setOpen(!open)} className="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 dark:border-dark-border px-4 py-3 space-y-1 bg-white dark:bg-dark-bg transition-colors">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block py-2.5 px-3 rounded-lg text-sm transition-colors ${isActive
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-muted'}`
              }>
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}
