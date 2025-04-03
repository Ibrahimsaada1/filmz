'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/app/components/Header'
import { useAuth } from '@/lib/auth/AuthContext'
import { getTMDBImageUrl } from '@/lib/services/tmdb'
import { Film, Clock, Calendar } from 'lucide-react'

type PurchasedMovie = {
  id: number
  title: string
  thumbnailUrl: string
  rating: number
  genre: string
  purchaseDate: string
  pricePaid: number
  currency: string
}

export default function LibraryPageClient() {
  const [movies, setMovies] = useState<PurchasedMovie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const { token } = useAuth()
  const router = useRouter()

  useEffect(() => {
    async function fetchPurchasedMovies() {
      try {
        const response = await fetch('/api/user/purchases', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch your purchased movies')
        }

        const data = await response.json()
        setMovies(data)
      } catch (error) {
        console.error('Error fetching library:', error)
        setError(error instanceof Error ? error.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPurchasedMovies()
  }, [router, token])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center mb-8">
            <Film className="w-6 h-6 text-red-600 mr-2" />
            <h1 className="text-3xl font-bold">My Library</h1>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="container mx-auto px-4 py-24">
        <div className="flex items-center mb-8">
          <Film className="w-6 h-6 text-red-600 mr-2" />
          <h1 className="text-3xl font-bold">My Library</h1>
        </div>

        {error && (
          <div className="bg-red-600/20 border border-red-600 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        )}

        {movies.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center max-w-2xl mx-auto">
            <div className="text-gray-400 mb-6">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm0-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="text-xl font-semibold mb-2">
                Your library is empty
              </h2>
              <p className="mb-6">
                You haven&apos;t purchased any movies yet. Browse our collection and
                buy your first movie to start building your library.
              </p>
            </div>
            <Link
              href="/movies"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md transition-colors inline-flex items-center"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 flex flex-col h-full"
                >
                  <Link
                    href={`/movies/watch/${movie.id}`}
                    className="block relative aspect-[2/3]"
                  >
                    <Image
                      src={
                        movie.thumbnailUrl
                          ? getTMDBImageUrl(movie.thumbnailUrl)
                          : '/placeholder-poster.png'
                      }
                      alt={movie.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute top-0 right-0 bg-red-600 text-white text-xs px-2 py-1 m-2 rounded">
                      {movie.genre}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                      <div className="flex items-center text-yellow-400 text-sm">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {movie.rating.toFixed(1)}
                      </div>
                    </div>
                  </Link>

                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">
                      {movie.title}
                    </h3>

                    <div className="mt-auto space-y-3">
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          Purchased:{' '}
                          {new Date(movie.purchaseDate).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-400">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>Available forever</span>
                      </div>

                      <Link
                        href={`/movies/watch/${movie.id}`}
                        className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors"
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
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Watch Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {movies.length > 0 && (
              <div className="flex justify-center mt-8">
                <Link
                  href="/movies"
                  className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-md transition-colors inline-flex items-center"
                >
                  Browse More Movies
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
