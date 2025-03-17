import { dbClient } from '../internal/db-client'

// Export the dbClient for server components
export { dbClient }

// Add any server-only database utilities here
export async function getMovieById(id: number) {
  // First try to find by internal ID
  const movie = await dbClient.movie.findUnique({
    where: { id },
    include: {
      genre: true,
      pricing: true,
    },
  })
  
  if (movie) return movie
  
  // If not found, check if the ID might be a TMDB ID
  return getMovieByTmdbId(id)
}

export async function getSimilarMovies(tmdbId: number) {
  // First get movies with the same genre
  const movie = await dbClient.movie.findUnique({
    where: { tmdbId },
    include: { genre: true },
  })

  if (!movie || !movie.genreId) return []

  return dbClient.movie.findMany({
    where: {
      genreId: movie.genreId,
      id: { not: movie.id },
    },
    take: 5,
    orderBy: { rating: 'desc' },
  })
}

// Add this function to get a movie by TMDB ID
export async function getMovieByTmdbId(tmdbId: number) {
  return dbClient.movie.findUnique({
    where: { tmdbId },
    include: {
      genre: true,
      pricing: true,
    },
  })
}

// Add this function to get multiple movies for static generation
export async function getTopMovies(limit: number = 20) {
  return dbClient.movie.findMany({
    take: limit,
    orderBy: { rating: 'desc' },
    where: {
      // Only include movies with complete data
      thumbnailUrl: { not: null },
      description: { not: '' },
    },
  })
} 