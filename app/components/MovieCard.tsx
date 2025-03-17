'use client'

import Image from 'next/image'
import Link from 'next/link'
import { getTMDBImageUrl } from '@/lib/services/tmdb'
import { useEffect, useState } from 'react'

export function MovieCard({ movie }) {
  const [isClient, setIsClient] = useState(false)
  
  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Handle both TMDB and database movie formats
  const posterPath = movie.poster_path || movie.thumbnailUrl
  const releaseDate = movie.release_date || movie.releaseDate
  const rating = movie.vote_average || movie.rating || 0
  
  // Use a fallback pricing object if none exists
  const pricing = movie.pricing || { basePrice: 9.99, currency: 'USD', discountPercent: 0 }
  
  // Calculate discount price if applicable
  const hasDiscount = pricing.discountPercent > 0
  const basePrice = pricing.basePrice || 9.99
  const discountPrice = hasDiscount 
    ? basePrice * (1 - pricing.discountPercent / 100)
    : null
  
  // Fallback image for when movie images are missing
  const fallbackImageUrl = '/placeholder-poster.jpg'
  
  return (
    <Link href={`/movies/${movie.id}`} className="group">
      <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-gray-800">
        <Image
          src={
            movie.thumbnailUrl
              ? getTMDBImageUrl(movie.thumbnailUrl, 'w500')
              : fallbackImageUrl
          }
          alt={movie.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {movie.genre && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
            {movie.genre.name}
          </span>
        )}
        
        {/* Price tag */}
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {hasDiscount ? (
            <div className="flex items-center">
              <span className="line-through text-gray-400 mr-1">${basePrice.toFixed(2)}</span>
              <span className="font-bold">${discountPrice.toFixed(2)}</span>
            </div>
          ) : (
            <span>${basePrice.toFixed(2)}</span>
          )}
        </div>
        
        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute top-10 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
            {pricing.discountPercent}% OFF
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center text-yellow-400 text-sm">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {(movie.rating || 0).toFixed(1)}
          </div>
        </div>
      </div>
      <div className="p-2">
        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-red-500 transition-colors">
          {movie.title}
        </h3>
      </div>
    </Link>
  )
} 