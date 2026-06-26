import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const links = [
  { section: 'home',     path: '/',         label: 'Home' },
  { section: 'projects', path: '/projects', label: 'Projects' },
  { section: 'contact',  path: '/contact',  label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const handleNav = (link) => {
    setOpen(false)
    // If already on a public page, scroll smoothly
    if (window.__scrollToSection) {
      window.__scrollToSection(link.section)
      window.history.pushState({}, '', link.path)
    } else {
      navigate(link.path)
    }
  }

  const isActive = (link) => {
    if (link.path === '/') return location.pathname === '/'
    return location.pathname.startsWith(link.path)
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-[#0d0e1af2] backdrop-blur-md border-b border-gray-200 dark:border-dark-border transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        <button onClick={() => handleNav(links[0])} className="font-bold text-indigo-600 dark:text-indigo-400 text-xl tracking-tight">
          Kushal.dev
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <button key={l.path} onClick={() => handleNav(l)}
              className={`text-sm font-medium transition-colors ${isActive(l)
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}>
              {l.label}
            </button>
          ))}
          <button onClick={toggle} aria-label="Toggle theme"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-dark-muted hover:bg-gray-200 dark:hover:bg-dark-muted text-gray-600 dark:text-gray-300 transition-all duration-200">
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={toggle} aria-label="Toggle theme"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-dark-muted text-gray-600 dark:text-gray-300">
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button onClick={() => setOpen(!open)} className="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-gray-400">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200 dark:border-dark-border px-4 py-3 space-y-1 bg-white dark:bg-dark-bg">
          {links.map(l => (
            <button key={l.path} onClick={() => handleNav(l)}
              className={`block w-full text-left py-2.5 px-3 rounded-lg text-sm transition-colors ${isActive(l)
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-muted'
              }`}>
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}
