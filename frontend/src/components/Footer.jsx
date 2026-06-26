import { Link } from 'react-router-dom'
import { Github, Linkedin, Mail, Heart } from 'lucide-react'

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
]

const SOCIAL = [
  { href: 'https://github.com/Ghimire-Kushal', icon: Github, label: 'GitHub' },
  { href: 'https://linkedin.com/in/kushal-ghimire-531a87287', icon: Linkedin, label: 'LinkedIn' },
  { href: 'mailto:kushal.upr@gmail.com', icon: Mail, label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">

        {/* 3-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <Link to="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Kushal.dev</Link>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Full Stack Developer building modern web experiences with clean architecture and great UI.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-widest mb-4">Navigation</h3>
            <ul className="space-y-2.5">
              {NAV.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="/api/upload/resume/download" download="Kushal-Ghimire-Resume.pdf"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Resume
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-widest mb-4">Connect</h3>
            <div className="flex flex-col gap-3">
              {SOCIAL.map(({ href, icon: Icon, label }) => (
                <a key={label} href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors w-fit">
                  <Icon size={15} /> {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-100 dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400 dark:text-gray-500">
          <p>© {new Date().getFullYear()} Kushal Ghimire. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with <Heart size={13} className="text-red-400 fill-red-400" /> using React &amp; FastAPI
          </p>
        </div>
      </div>
    </footer>
  )
}
