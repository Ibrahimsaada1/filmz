'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Header } from '@/app/components/Header'
import { getTMDBImageUrl } from '@/lib/services/tmdb'
import { FavoriteButton } from '@/app/components/FavoriteButton'
import { PurchaseModal } from '@/app/components/PurchaseModal'
import { Movie, Genre, Pricing } from '@prisma/client'
import Link from 'next/link'

// Create a type that includes the relations
type MovieWithRelations = Movie & {
  genre?: Genre
  pricing: Pricing
}

export function MovieDetailClient({
  movie,
  isPurchased,
}: {
  movie: MovieWithRelations
  isPurchased: boolean
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fallback image
  const fallbackImageUrl = '/images/placeholder.png'

  // Calculate discount price if applicable
  const hasDiscount = movie.pricing?.discountPercent ?? 0 > 0
  const basePrice = movie.pricing?.basePrice ?? 0
  const discountPrice = hasDiscount
    ? basePrice * (1 - (movie.pricing?.discountPercent ?? 0) / 100)
    : basePrice

  const handlePurchaseComplete = () => {
    setIsModalOpen(false)
    // Refresh the page
    window.location.reload()
    // You could add additional logic here if needed
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />

      {/* Hero Section with Movie Backdrop */}
      <div className="relative h-[40vh] w-full">
        <div className="absolute inset-0">
          <Image
            src={
              movie.thumbnailUrl
                ? getTMDBImageUrl(movie.thumbnailUrl, 'original')
                : fallbackImageUrl
            }
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent" />
        </div>
      </div>

      {/* Movie Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Movie Poster */}
          <div className="relative w-full md:w-1/3 lg:w-1/4 aspect-[2/3] rounded-lg overflow-hidden">
            <Image
              src={
                movie.thumbnailUrl
                  ? getTMDBImageUrl(movie.thumbnailUrl, 'w500')
                  : fallbackImageUrl
              }
              alt={movie.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Movie Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {movie.title}
              </h1>
              <FavoriteButton movieId={movie.id} className="bg-gray-800 p-3" />
            </div>

            <div className="flex items-center gap-4 mb-4">
              {movie.genre && (
                <span className="bg-red-600 text-white text-sm px-2 py-1 rounded">
                  {movie.genre.name}
                </span>
              )}
              <div className="flex items-center text-yellow-400">
                <svg
                  className="w-5 h-5 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{(movie.rating || 0).toFixed(1)}</span>
              </div>
            </div>

            <p className="text-gray-300 mb-6">{movie.description}</p>

            {isPurchased ? (
              <div className="mb-6">
                <Link
                  href={`/watch/${movie.id}`}
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-md transition-colors"
                >
                  Watch Now
                </Link>
              </div>
            ) : (
              // Pricing Section
              <div className="bg-gray-800 p-6 rounded-lg mb-6">
                <h2 className="text-xl font-bold mb-4">Buy or Rent</h2>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex flex-col">
                    {hasDiscount ? (
                      <>
                        <div className="flex items-center">
                          <span className="text-gray-400 line-through text-lg mr-2">
                            ${basePrice.toFixed(2)}
                          </span>
                          <span className="text-2xl font-bold text-white">
                            ${discountPrice.toFixed(2)}
                          </span>
                          <span className="ml-2 text-sm bg-red-600 text-white px-2 py-1 rounded">
                            {movie.pricing?.discountPercent}% OFF
                          </span>
                        </div>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-white">
                        ${basePrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-md transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
                <p className="text-sm text-gray-400">
                  Purchase includes unlimited streaming and downloads.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {isModalOpen && (
        <PurchaseModal
          movie={movie}
          onClose={() => setIsModalOpen(false)}
          onPurchaseComplete={handlePurchaseComplete}
        />
      )}
    </div>
  )
}
