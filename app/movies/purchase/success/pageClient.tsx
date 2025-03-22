'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/app/components/Header'
import { useAuth } from '@/lib/auth/AuthContext'

export default function PurchaseSuccessPageClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Get parameters from URL or localStorage
  const movieId = searchParams.get('id')
  const orderId = searchParams.get('orderId')
  
  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search))
      return
    }
    
    // Try to get purchase info from localStorage if not in URL
    let id = movieId
    let order = orderId
    
    if ((!id || !order) && localStorage.getItem('lastPurchase')) {
      try {
        const lastPurchase = JSON.parse(localStorage.getItem('lastPurchase'))
        id = id || lastPurchase.movieId
        order = order || lastPurchase.orderId
        
        // If we have the title, we can set it directly
        if (lastPurchase.title) {
          setMovie({ title: lastPurchase.title })
        }
      } catch (e) {
        console.error('Error parsing lastPurchase from localStorage:', e)
      }
    }
    
    if (!id) {
      router.push('/movies')
      return
    }
    
    async function fetchMovie() {
      try {
        const response = await fetch(`/api/movies/${id}`)
        if (!response.ok) throw new Error('Failed to fetch movie')
        
        const data = await response.json()
        setMovie(data)
      } catch (error) {
        console.error('Error fetching movie:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchMovie()
    
    // Clean up localStorage after successful navigation
    return () => {
      localStorage.removeItem('lastPurchase')
    }
  }, [movieId, orderId, isAuthenticated, router])
  
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
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Purchase Successful!</h1>
          
          <p className="text-xl mb-6">
            Thank you for your purchase of <span className="font-semibold">{movie?.title}</span>
          </p>
          
          <div className="bg-gray-700/50 p-4 rounded-lg mb-6 inline-block mx-auto">
            <p className="text-gray-300">Order ID: {orderId}</p>
          </div>
          
          <div className="space-y-4">
            <Link
              href={`/movies/watch/${movieId}`}
              className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition-colors"
            >
              Watch Movie
            </Link>
            
            <Link
              href="/movies"
              className="block w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-md transition-colors"
            >
              Browse More Movies
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 