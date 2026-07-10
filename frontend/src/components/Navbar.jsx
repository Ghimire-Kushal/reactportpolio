import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Moon, Sun } from 'lucide-react'
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
} from '@heroui/react'
import { useTheme } from '../context/ThemeContext'

const links = [
  { path: '/',         label: 'Home' },
  { path: '/projects', label: 'Projects' },
  { path: '/contact',  label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const handleNav = (link) => {
    setOpen(false)
    navigate(link.path)
  }

  const isActive = (link) => {
    if (link.path === '/') return location.pathname === '/'
    return location.pathname.startsWith(link.path)
  }

  return (
    <HeroNavbar
      isMenuOpen={open}
      onMenuOpenChange={setOpen}
      className="bg-white/90 dark:bg-[#0d0e1af2] backdrop-blur-md border-b border-gray-200 dark:border-dark-border"
      maxWidth="xl"
    >
      <NavbarContent justify="start">
        <NavbarBrand>
          <button onClick={() => handleNav(links[0])} className="font-bold text-indigo-600 dark:text-indigo-400 text-xl tracking-tight">
            Kushal.dev
          </button>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden md:flex gap-8" justify="center">
        {links.map(l => (
          <NavbarItem key={l.path} isActive={isActive(l)}>
            <button onClick={() => handleNav(l)}
              className={`text-sm font-medium transition-colors ${isActive(l)
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}>
              {l.label}
            </button>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden md:flex">
          <Button isIconOnly size="sm" variant="flat" radius="lg" onPress={toggle} aria-label="Toggle theme">
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </Button>
        </NavbarItem>
        <NavbarItem className="flex md:hidden">
          <Button isIconOnly size="sm" variant="flat" radius="lg" onPress={toggle} aria-label="Toggle theme">
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </Button>
        </NavbarItem>
        <NavbarMenuToggle
          className="md:hidden"
          icon={open ? <X size={20} /> : <Menu size={20} />}
          aria-label={open ? 'Close menu' : 'Open menu'}
        />
      </NavbarContent>

      <NavbarMenu className="bg-white dark:bg-dark-bg">
        {links.map(l => (
          <NavbarMenuItem key={l.path}>
            <button onClick={() => handleNav(l)}
              className={`block w-full text-left py-2.5 px-3 rounded-lg text-sm transition-colors ${isActive(l)
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-muted'
              }`}>
              {l.label}
            </button>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </HeroNavbar>
  )
}
