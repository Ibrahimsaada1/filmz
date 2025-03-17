'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getTMDBImageUrl } from '@/lib/services/tmdb'
import { useAuth } from '@/lib/auth/AuthContext'
import { Genre, Movie, Pricing } from '@prisma/client'

export interface PurchaseModalProps {
  movie: Movie & { pricing: Pricing, genre?: Genre }
  onClose: () => void
  onPurchaseComplete?: () => void
}

export function PurchaseModal({ movie, onClose, onPurchaseComplete }: PurchaseModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('credit_card')
  const [error, setError] = useState('')
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const router = useRouter()
  const { isAuthenticated, token } = useAuth()
  
  // Calculate price
  const pricing = movie.pricing || { basePrice: 9.99, currency: 'USD' }
  const hasDiscount = pricing?.discountPercent ?? 0 > 0
  const finalPrice = hasDiscount 
    ? pricing.basePrice * (1 - (pricing?.discountPercent ?? 0) / 100)
    : pricing.basePrice
  
  const handlePurchase = async () => {
    setError('')
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Store the intended purchase in localStorage to resume after login
      localStorage.setItem('pendingPurchase', JSON.stringify({
        movieId: movie.id,
        price: finalPrice,
        paymentMethod
      }))
      
      // Redirect to login with return URL
      router.push(`/login?redirect=/movies/${movie.id}`)
      return
    }
    
    setIsProcessing(true)
    
    try {
      // Make API call to process purchase
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          movieId: movie.id,
          price: finalPrice,
          paymentMethod
        })
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to complete purchase')
      }
      
      // Successful purchase
      const data = await response.json()
      setOrderId(data.orderId)
      setPurchaseSuccess(true)
      
      // Call the onPurchaseComplete callback
      if (onPurchaseComplete) {
        onPurchaseComplete()
      }
      
      // No redirect, just show success in the modal
    } catch (error) {
      console.error('Purchase error:', error)
      setError((error as Error).message || 'An error occurred during purchase')
    } finally {
      setIsProcessing(false)
    }
  }
  
  const handleWatchNow = () => {
    onClose()
    router.push(`/movies/watch/${movie.id}`)
  }
  
  // If purchase was successful, show success message
  if (purchaseSuccess) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg max-w-2xl w-full">
          <div className="p-6 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Purchase Successful!</h2>
            
            <p className="text-xl mb-6">
              Thank you for your purchase of <span className="font-semibold">{movie.title}</span>
            </p>
            
            <div className="bg-gray-700/50 p-4 rounded-lg mb-6 inline-block mx-auto">
              <p className="text-gray-300">Order ID: {orderId}</p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={handleWatchNow}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition-colors"
              >
                Watch Now
              </button>
              
              <button
                onClick={onClose}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
    // Regular purchase modal
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-white">Complete Your Purchase</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
              {error}
            </div>
          )}
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Movie Info */}
            <div className="md:w-1/3">
              <div className="rounded-lg overflow-hidden">
                <Image
                  src={getTMDBImageUrl(movie.thumbnailUrl)}
                  alt={movie.title}
                  width={300}
                  height={450}
                  className="w-full h-auto"
                />
              </div>
              <h3 className="text-xl font-bold mt-4">{movie.title}</h3>
              <p className="text-gray-400 text-sm">{movie.genre?.name || 'Drama'}</p>
            </div>
            
            {/* Purchase Form */}
            <div className="md:w-2/3">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span>Movie Price</span>
                    <span>${pricing.basePrice.toFixed(2)}</span>
                  </div>
                  
                  {hasDiscount && (
                    <div className="flex justify-between mb-2 text-red-400">
                      <span>Discount ({pricing.discountPercent}%)</span>
                      <span>-${(pricing.basePrice - finalPrice).toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-600 my-2 pt-2"></div>
                  
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${finalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-3 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="credit_card"
                      checked={paymentMethod === 'credit_card'}
                      onChange={() => setPaymentMethod('credit_card')}
                      className="form-radio text-red-600"
                    />
                    <span>Credit Card</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                      className="form-radio text-red-600"
                    />
                    <span>PayPal</span>
                  </label>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-md transition-colors"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                
                <button
                  onClick={handlePurchase}
                  disabled={isProcessing}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Complete Purchase'
                  )}
                </button>
              </div>
              
              <p className="text-sm text-gray-400 mt-4 text-center">
                By completing this purchase, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 