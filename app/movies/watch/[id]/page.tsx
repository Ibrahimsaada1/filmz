'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/app/components/Header'
import { useAuth } from '@/lib/auth/AuthContext'

export const dynamic = 'force-dynamic'

export default function WatchMoviePage({ params }) {
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hasPurchased, setHasPurchased] = useState(false)
  const [error, setError] = useState('')
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { id } = params
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/movies/watch/${id}`)
      return
    }
    
    async function fetchData() {
      try {
        // Fetch movie details
        const movieResponse = await fetch(`/api/movies/${id}`)
        if (!movieResponse.ok) throw new Error('Failed to fetch movie')
        const movieData = await movieResponse.json()
        setMovie(movieData)
        
        // Check purchase status
        const purchaseResponse = await fetch(`/api/purchases/check?movieId=${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        if (!purchaseResponse.ok) throw new Error('Failed to verify purchase')
        
        const purchaseData = await purchaseResponse.json()
        setHasPurchased(purchaseData.purchased)
        
        if (!purchaseData.purchased) {
          setError('You need to purchase this movie to watch it')
        }
      } catch (error) {
        console.error('Error:', error)
        setError(error.message || 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [id, isAuthenticated, router])
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <div className="flex gap-4">
              <button
                onClick={() => router.push(`/movies/${id}`)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Purchase Movie
              </button>
              <button
                onClick={() => router.push('/movies')}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                Browse Movies
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{movie?.title}</h1>
        
        {/* Video Player */}
        <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden mb-6">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <svg className="w-20 h-20 mx-auto text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              <p className="mt-4 text-xl">Video playback would start here</p>
              <p className="text-gray-400 mt-2">This is a demo application - no actual video content is available</p>
            </div>
          </div>
        </div>
        
        {/* Movie Info */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-2">About this movie</h2>
          <p className="text-gray-300 mb-4">{movie?.description}</p>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <div>Genre: {movie?.genre?.name || 'Unknown'}</div>
            <div>Rating: ⭐ {movie?.rating?.toFixed(1) || 'N/A'}</div>
            <div>Release Date: {movie?.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : 'Unknown'}</div>
          </div>
        </div>
      </div>
    </div>
  )
} 