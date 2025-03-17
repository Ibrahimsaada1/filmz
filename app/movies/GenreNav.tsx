import { dbClient } from '@/lib/internal/db-client'
import { GenreNavClient } from './GenreNavClient'

// Define props type
type GenreNavProps = {
  currentGenre: string
}

// Fetch genres from the server
async function getGenres() {
  try {
    const genres = await dbClient.genre.findMany({
      orderBy: {
        name: 'asc',
      },
    })
    return genres
  } catch (error) {
    console.error('Error fetching genres:', error)
    return []
  }
}

// Server component that fetches data and passes it to the client component
export async function GenreNav({ currentGenre }: GenreNavProps) {
  const genres = await getGenres()
  
  return <GenreNavClient genres={genres} currentGenre={currentGenre} />
} 