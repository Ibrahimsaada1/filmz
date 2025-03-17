import {
  Genre,
  Movie,
  Pricing,
  UserLike,
  UserPurchase,
} from '@prisma/client'
import {
  TMDB_ACCESS_TOKEN,
  TMDB_API_URL,
  TMDB_IMAGE_URL,
} from '../config.server'
import { dbClient } from '../internal/db-client'

// Types for TMDB responses
interface TMDBMovie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  original_title: string
  video: boolean
}

interface TMDBResponse<T> {
  results: T[]
  page: number
  total_pages: number
  total_results: number
}

/**
 * Get the full URL for a TMDB image
 */
export function getTMDBImageUrl(
  path: string | null,
  size: string = 'w500',
): string {
  if (!path) {
    return '/images/placeholder.png' // Use our placeholder image
  }
  return `https://image.tmdb.org/t/p/${size}${path}`
}

// Fetch popular movies from TMDB
export async function fetchPopularMovies(
  page: number = 1,
): Promise<TMDBMovie[]> {
  try {
    const response = await fetch(
      `${TMDB_API_URL}/discover/movie?language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    )

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }

    const data: TMDBResponse<TMDBMovie> = await response.json()

    // Upsert movies to database before returning
    await upsertMoviesToDatabase(data.results)

    console.log('Sample movie data:', data.results[0])

    return data.results
  } catch (error) {
    console.error('Error fetching popular movies from TMDB:', error)
    return []
  }
}

// Fetch movies by genre
export async function fetchMoviesByGenre(
  genreId: number,
  page: number = 1,
): Promise<TMDBMovie[]> {
  try {
    const response = await fetch(
      `${TMDB_API_URL}/discover/movie?with_genres=${genreId}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 },
      },
    )

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }

    const data: TMDBResponse<TMDBMovie> = await response.json()

    // Upsert movies to database before returning
    await upsertMoviesToDatabase(data.results)

    console.log('Sample movie data:', data.results[0])

    return data.results
  } catch (error) {
    console.error('Error fetching movies by genre from TMDB:', error)
    return []
  }
}

// Fetch movie details
export async function fetchMovieDetails(
  movieId: number,
): Promise<TMDBMovie | null> {
  try {
    const response = await fetch(`${TMDB_API_URL}/movie/${movieId}`, {
      headers: {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 86400 }, // Cache for 24 hours
    })

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }

    const movie = await response.json()

    // Upsert single movie to database
    await upsertMovieToDatabase(movie)

    return movie
  } catch (error) {
    console.error(`Error fetching movie details for ID ${movieId}:`, error)
    return null
  }
}

// Fetch TMDB genres
export async function fetchGenres(
  language: string = 'en',
): Promise<{ id: number; name: string }[]> {
  try {
    const response = await fetch(
      `${TMDB_API_URL}/genre/movie/list?language=${language}`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 86400 * 7 }, // Cache for a week
      },
    )

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }

    const data = await response.json()

    // Upsert genres to database
    await upsertGenresToDatabase(data.genres)

    return data.genres
  } catch (error) {
    console.error('Error fetching genres from TMDB:', error)
    return []
  }
}

// Search movies
export async function searchMovies(
  query: string,
  page: number = 1,
): Promise<TMDBMovie[]> {
  try {
    const response = await fetch(
      `${TMDB_API_URL}/search/movie?query=${encodeURIComponent(
        query,
      )}&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 },
      },
    )

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }

    const data: TMDBResponse<TMDBMovie> = await response.json()

    // Upsert movies to database before returning
    await upsertMoviesToDatabase(data.results)

    return data.results
  } catch (error) {
    console.error('Error searching movies from TMDB:', error)
    return []
  }
}

export type MovieWithRelations = Movie & {
  genre?: Genre
  pricing?: Pricing
  likes?: UserLike[]
  purchases?: UserPurchase[]
}

// Helper function to upsert multiple movies to database
async function upsertMoviesToDatabase(movies: TMDBMovie[]) {
  const updatedMovies: MovieWithRelations[] = []
  try {
    for (const movie of movies) {
      const updatedMovie = await upsertMovieToDatabase(movie)
      updatedMovies.push(updatedMovie as MovieWithRelations)
    }
    console.log(`Upserted ${movies.length} movies to database`)

    return updatedMovies
  } catch (error) {
    console.error('Error upserting movies to database:', error)
  }
}

// Helper function to upsert a single movie to database
async function upsertMovieToDatabase(movie: TMDBMovie) {
  try {
    // Find the primary genre for this movie
    const primaryGenreId = movie.genre_ids?.[0] || null

    // Find the genre in our database
    let genreId = null
    if (primaryGenreId) {
      const genre = await prisma.genre.findUnique({
        where: { tmdbId: primaryGenreId },
      })
      genreId = genre?.id || null
    }

    // Check if the movie already exists
    const existingMovie = await dbClient.movie.findUnique({
      where: { tmdbId: movie.id },
      include: { pricing: true },
    })

    // Always generate pricing data
    // If the movie exists and has pricing, we'll keep it
    // If not, we'll create new pricing
    const basePrice =
      existingMovie?.pricing?.basePrice ||
      parseFloat((Math.floor(Math.random() * 6) + 9).toFixed(2))

    const shouldDiscount = Math.random() > 0.7
    const discountPercent =
      existingMovie?.pricing?.discountPercent ||
      (shouldDiscount ? Math.floor(Math.random() * 30) + 10 : null)

    // Create or update the movie
    const updatedMovie = await dbClient.movie.upsert({
      where: { tmdbId: movie.id },
      update: {
        title: movie.title,
        description: movie.overview,
        thumbnailUrl: movie.poster_path
          ? `${TMDB_IMAGE_URL}/w500${movie.poster_path}`
          : '/images/placeholder.png',
        backdropUrl: movie.backdrop_path
          ? `${TMDB_IMAGE_URL}/original${movie.backdrop_path}`
          : null,
        releaseDate: movie.release_date ? new Date(movie.release_date) : null,
        rating: movie.vote_average,
        genreId: genreId,
        pricing: existingMovie?.pricing
          ? undefined // Don't update existing pricing
          : {
              create: {
                basePrice,
                discountPercent,
                currency: 'USD',
              },
            },
      },
      create: {
        tmdbId: movie.id,
        title: movie.title,
        description: movie.overview,
        thumbnailUrl: movie.poster_path
          ? `${TMDB_IMAGE_URL}/w500${movie.poster_path}`
          : '/images/placeholder.png',
        backdropUrl: movie.backdrop_path
          ? `${TMDB_IMAGE_URL}/original${movie.backdrop_path}`
          : null,
        releaseDate: movie.release_date ? new Date(movie.release_date) : null,
        rating: movie.vote_average,
        genreId: genreId,
        pricing: {
          create: {
            basePrice: 9.99, // Fixed price for new movies
            discountPercent: null, // No discount by default
            currency: 'USD',
          },
        },
      },
      select: {
        id: true,
        backdropUrl: true,
        description: true,
        genreId: true,
        pricing: true,
        releaseDate: true,
        rating: true,
        genre: true,
        tmdbId: true,
        title: true,
        thumbnailUrl: true,
        createdAt: true,
        likes: true,
        _count: true,
        purchases: true,
        reviews: true,
        updatedAt: true,
      },
    })

    // If we just created a movie without pricing (shouldn't happen with the logic above, but just in case)
    if (!existingMovie?.pricing) {
      if (!updatedMovie?.pricing) {
        // Create pricing if it doesn't exist
        await dbClient.pricing.create({
          data: {
            movieId: updatedMovie.id,
            basePrice: 9.99,
            currency: 'USD',
          },
        })
      }
    }

    return updatedMovie
  } catch (error) {
    console.error(`Error upserting movie ${movie.title} to database:`, error)
  }
}

// Helper function to upsert genres to database
async function upsertGenresToDatabase(genres: { id: number; name: string }[]) {
  try {
    for (const genre of genres) {
      await dbClient.genre.upsert({
        where: { tmdbId: genre.id },
        update: { name: genre.name },
        create: {
          tmdbId: genre.id,
          name: genre.name,
        },
      })
    }
    console.log(`Upserted ${genres.length} genres to database`)
  } catch (error) {
    console.error('Error upserting genres to database:', error)
  }
}

export async function fetchTMDBMovies(page: number = 1) {
  try {
    const response = await fetch(
      `${TMDB_API_URL}/discover/movie?` +
        new URLSearchParams({
          include_adult: 'false',
          include_video: 'false',
          language: 'en-US',
          page: page.toString(),
          sort_by: 'popularity.desc',
        }),
      {
        headers: {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
          Accept: 'application/json',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    )

    if (!response.ok) {
      throw new Error(
        `TMDB API error: ${response.status} ${response.statusText}`,
      )
    }

    const data: TMDBResponse<TMDBMovie> = await response.json()

    console.log(
      `Successfully fetched ${data.results.length} movies from TMDB (Page ${page}/${data.total_pages})`,
    )

    return data
  } catch (error) {
    console.error('Error fetching movies from TMDB:', error)
    throw error
  }
}

export async function syncTMDBMovies(page: number = 1) {
  const tmdbMovies = await fetchTMDBMovies(page)

  const movies = await upsertMoviesToDatabase(tmdbMovies.results)
  return {
    movies: movies ?? [],
    totalPages: tmdbMovies.total_pages,
  }
}
