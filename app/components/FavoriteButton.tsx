'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface FavoriteButtonProps {
  movieId: number
  className?: string
}

export function FavoriteButton({
  movieId,
  className = '',
}: FavoriteButtonProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Check if movie is already liked when component mounts
  useEffect(() => {
    if (status === 'authenticated') {
      checkLikeStatus()
    }
  }, [status, movieId])

  // Function to check if movie is liked
  async function checkLikeStatus() {
    try {
      const response = await fetch(`/api/favorites?movieId=${movieId}`)
      const data = await response.json()
      setIsLiked(data.liked)
    } catch (error) {
      console.error('Error checking like status:', error)
    }
  }

  // Function to toggle like status
  async function toggleFavorite() {
    if (status !== 'authenticated') {
      // Redirect to login if not authenticated
      router.push(
        '/login?callbackUrl=' + encodeURIComponent(window.location.href),
      )
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieId }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsLiked(data.liked)
        // Refresh the page to update UI if needed
        router.refresh()
      } else {
        console.error('Error toggling favorite:', data.error)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`flex items-center justify-center rounded-full p-2 transition-colors ${
        isLiked
          ? 'text-red-500 hover:text-red-600'
          : 'text-gray-400 hover:text-red-500'
      } ${className}`}
      aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg
        className={`w-6 h-6 ${isLoading ? 'animate-pulse' : ''}`}
        fill={isLiked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  )
}
