'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  // Add scroll effect to change header background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? 'bg-black' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-10">
            <h1 className="text-2xl font-bold text-red-600">
              <span className="flex items-center">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
                Filmz
              </span>
            </h1>
          </Link>

          <nav className="hidden md:flex space-x-6">
            <NavLink path="/" label="Home" currentPath={pathname} />
            <NavLink path="/movies" label="Movies" currentPath={pathname} />
            <NavLink
              path="/library"
              label="My Library"
              currentPath={pathname}
            />
            <Link
              href="/favorites"
              className={`text-gray-300 hover:text-white transition-colors ${
                pathname === '/favorites' ? 'text-white font-medium' : ''
              }`}
            >
              My Favorites
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <button className="text-white p-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
          <a href="/profile" className="text-white p-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </a>
        </div>
      </div>
    </header>
  )
}

function NavLink({
  path,
  label,
  currentPath,
}: {
  path: string
  label: string
  currentPath: string
}) {
  const isActive =
    currentPath === path || (path !== '/' && currentPath.startsWith(path))

  return (
    <a
      href={path}
      className={`transition-colors ${
        isActive ? 'text-white font-medium' : 'text-gray-300 hover:text-white'
      }`}
    >
      {label}
    </a>
  )
}
