'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PurchaseModal } from './PurchaseModal'
import { useAuth } from '@/lib/auth/AuthContext'

export function BuyNowButton({ movie, initialPurchaseState = false }) {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [hasPurchased, setHasPurchased] = useState(initialPurchaseState)
  const [isLoading, setIsLoading] = useState(!initialPurchaseState)
  const { isAuthenticated, token } = useAuth()
  const router = useRouter()
  
  // Check if user has already purchased this movie (only if not provided initially)
  useEffect(() => {
    if (initialPurchaseState) {
      setIsLoading(false)
      return
    }
    
    if (!isAuthenticated) {
      setIsLoading(false)
      return
    }
    
    async function checkPurchaseStatus() {
      try {
        const response = await fetch(`/api/purchases/check?movieId=${movie.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setHasPurchased(data.purchased)
        }
      } catch (error) {
        console.error('Error checking purchase status:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkPurchaseStatus()
  }, [isAuthenticated, movie.id, token, initialPurchaseState])
  
  const handleBuyClick = () => {
    if (!isAuthenticated) {
      // Store the intended destination
      localStorage.setItem('authRedirect', `/movies/${movie.id}`)
      // Redirect to login
      router.push(`/login?redirect=/movies/${movie.id}`)
      return
    }
    
    // If authenticated, show the purchase modal
    setShowPurchaseModal(true)
  }
  
  const handlePlayClick = () => {
    router.push(`/movies/watch/${movie.id}`)
  }
  
  const handlePurchaseComplete = () => {
    setHasPurchased(true)
    // No need to close modal here, it will show success state
  }
  
  if (isLoading) {
    return (
      <button 
        disabled
        className="inline-flex items-center bg-gray-600 text-white font-bold py-3 px-8 rounded-md opacity-70"
      >
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading...
      </button>
    )
  }
  
  if (hasPurchased) {
    return (
      <button
        onClick={handlePlayClick}
        className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-md transition-colors duration-300"
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
      </button>
    )
  }
  
  return (
    <>
      <button
        onClick={handleBuyClick}
        className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-md transition-colors duration-300"
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
      </button>
      
      {showPurchaseModal && (
        <PurchaseModal 
          movie={movie} 
          onClose={() => setShowPurchaseModal(false)}
          onPurchaseComplete={handlePurchaseComplete}
        />
      )}
    </>
  )
} 