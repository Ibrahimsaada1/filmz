'use client'

import Link from 'next/link'

// Define props type
type Genre = {
  id: number
  name: string
}

type GenreNavClientProps = {
  genres: Genre[]
  currentGenre: string
}

// Client component for UI
export function GenreNavClient({ genres, currentGenre }: GenreNavClientProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/movies"
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          !currentGenre
            ? 'bg-red-600 text-white'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }`}
      >
        All Movies
      </Link>
      
      <Link
        href="/movies?genre=featured"
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          currentGenre === 'featured'
            ? 'bg-red-600 text-white'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }`}
      >
        Featured
      </Link>
      
      {genres.map((genre) => (
        <Link
          key={genre.id}
          href={`/movies?genre=${genre.id}`}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            currentGenre === genre.id.toString()
              ? 'bg-red-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {genre.name}
        </Link>
      ))}
    </div>
  )
} 