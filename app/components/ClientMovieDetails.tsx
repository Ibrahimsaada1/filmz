'use client'

import { useEffect, useState } from 'react'

export function ClientMovieDetails({ movieId }) {
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchMovie() {
      try {
        const response = await fetch(`/api/movies/${movieId}`)
        if (!response.ok) throw new Error('Failed to fetch movie')
        const data = await response.json()
        setMovie(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchMovie()
  }, [movieId])
  
  if (loading) return <div>Loading...</div>
  if (!movie) return <div>Movie not found</div>
  
  return (
    <div>
      <h1>{movie.title}</h1>
      {/* Rest of your component */}
    </div>
  )
} 