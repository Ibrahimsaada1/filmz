'use client'

import { useRouter, usePathname } from 'next/navigation'

export function MovieFilter({ currentGenre }: { currentGenre: string }) {
  const router = useRouter()
  const pathname = usePathname()
  
  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const genre = e.target.value
    
    if (genre) {
      router.push(`${pathname}?genre=${genre}`)
    } else {
      router.push(pathname)
    }
  }
  
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold">Browse Movies</h2>
      <select
        id="genre"
        value={currentGenre}
        onChange={handleGenreChange}
        className="bg-gray-900 text-white rounded-md px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
      >
        <option value="">All Genres</option>
        <option value="action">Action</option>
        <option value="comedy">Comedy</option>
        <option value="drama">Drama</option>
        <option value="horror">Horror</option>
        <option value="sci-fi">Sci-Fi</option>
      </select>
    </div>
  )
} 