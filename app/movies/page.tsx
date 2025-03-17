import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { GenreNav } from './GenreNav'
import { Header } from '@/app/components/Header'
import { MovieCard } from '@/app/components/MovieCard'
import { Pagination } from '@/app/components/Pagination'
import { getTMDBImageUrl } from '@/lib/services/tmdb'
import { dbClient } from '@/lib/internal/db-client'
import { Prisma } from '@prisma/client'

// Define the props type with ReadonlyURLSearchParams
type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}


export default async function MoviesPage({ searchParams }: Props) {
  // First sync with TMDB
  await syncMoviesWithTMDB()

  // Extract query parameters
  const pageParam = searchParams.page
  const genreParam = searchParams.genre
  const currentPage = typeof pageParam === 'string' ? parseInt(pageParam) : 1
  const genre = typeof genreParam === 'string' ? genreParam : ''

  // Define page size
  const pageSize = 20

  // Build where clause
  const where: Prisma.MovieWhereInput = {}

  // Add genre filter if provided and valid
  if (genre && genre !== 'featured' && !isNaN(parseInt(genre))) {
    where.genreId = parseInt(genre)
  }

  // Get total count for pagination
  const totalCount = await dbClient.movie.count({ where })

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize) || 1

  // Calculate skip value for pagination
  const skip = (currentPage - 1) * pageSize

  // Fetch movies with pagination and include pricing information
  const movies = await dbClient.movie.findMany({
    skip,
    take: pageSize,
    where,
    include: {
      genre: true,
      pricing: true, // Include pricing information
    },
    orderBy: {
      id: 'desc',
    },
  })

  // Process movies to ensure they have pricing
  const processedMovies = movies.map((movie) => {
    // If movie has pricing, use it; otherwise, use default pricing
    if (movie.pricing) {
      return movie
    } else {
      // Create default pricing if none exists
      return {
        ...movie,
        pricing: {
          id: 0,
          movieId: movie.id,
          basePrice: 9.99,
          discountPercent: 0,
          currency: 'USD',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }
    }
  })

  // Select a featured movie
  const featuredMovie =
    processedMovies.length > 0
      ? processedMovies[
          Math.floor(Math.random() * Math.min(5, processedMovies.length))
        ]
      : null

  // Fallback image for when movie images are missing
  const fallbackImageUrl = '/images/placeholder.png'

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />

      {/* Hero Section with Featured Movie */}
      {featuredMovie && (
        <div className="relative h-[70vh] w-full">
          <div className="absolute inset-0">
            <Image
              src={
                featuredMovie.thumbnailUrl
                  ? getTMDBImageUrl(featuredMovie.thumbnailUrl, 'original')
                  : fallbackImageUrl
              }
              alt={featuredMovie.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent" />
          </div>

          <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-16">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                {featuredMovie.title}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-yellow-500 font-bold flex items-center">
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {(featuredMovie.rating || 0).toFixed(1)}
                </span>
                <span className="text-gray-400">
                  {featuredMovie.releaseDate
                    ? new Date(featuredMovie.releaseDate).getFullYear()
                    : 'N/A'}
                </span>
              </div>
              <p className="text-gray-300 line-clamp-3 mb-6">
                {featuredMovie.description || 'No description available.'}
              </p>

              {/* Buy Now section with pricing */}
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  {featuredMovie.pricing?.discountPercent > 0 ? (
                    <>
                      <div className="flex items-center">
                        <span className="text-gray-400 line-through text-lg mr-2">
                          ${featuredMovie.pricing.basePrice.toFixed(2)}
                        </span>
                        <span className="text-2xl font-bold text-white">
                          $
                          {(
                            featuredMovie.pricing.basePrice *
                            (1 - featuredMovie.pricing.discountPercent / 100)
                          ).toFixed(2)}
                        </span>
                        <span className="ml-2 text-sm bg-red-600 text-white px-2 py-1 rounded">
                          {featuredMovie.pricing.discountPercent}% OFF
                        </span>
                      </div>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-white">
                      ${featuredMovie.pricing?.basePrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <Link
                  href={`/movies/${featuredMovie.id}`}
                  className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-md transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Buy Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Add space between main nav and genre nav */}
        <div className="mt-8 mb-12">
          <GenreNav currentGenre={genre} />
        </div>

        <div className="space-y-12">
          {/* Popular Movies Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6">
              {genre
                ? `${genre === 'featured' ? 'Featured' : ''} Movies`
                : 'Popular Movies'}
            </h2>

            <Suspense
              fallback={
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                </div>
              }
            >
              {processedMovies.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {processedMovies.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </div>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                  />
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">
                    No movies found. Try adjusting your filters.
                  </p>
                </div>
              )}
            </Suspense>
          </section>
        </div>
      </div>
    </div>
  )
}
