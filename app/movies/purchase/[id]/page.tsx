'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMovie } from '@/lib/api/movies'
import { useAuth } from '@/lib/auth/AuthContext'
import Image from 'next/image'
import { getTMDBImageUrl } from '@/lib/services/tmdb'
import { Header } from '@/app/components/Header'
import { PricingDisplay } from '@/app/components/PricingDisplay'

export default function PurchaseMoviePage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const { data: movie, isLoading, error } = useMovie(id)
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState('credit_card')
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(`/movies/purchase/${id}`)}`)
    }
  }, [isLoading, isAuthenticated, router, id])
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
    )
  }
  
  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>Error loading movie. Please try again later.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Calculate price
  const pricing = movie.pricing || { basePrice: 9.99, currency: 'USD' }
  const hasDiscount = pricing.discountPercent > 0
  const finalPrice = hasDiscount 
    ? pricing.basePrice * (1 - pricing.discountPercent / 100)
    : pricing.basePrice
  
  const handlePurchase = async () => {
    setIsProcessing(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false)
      router.push(`/movies/purchase/success?id=${id}`)
    }, 2000)
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Complete Your Purchase</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="flex items-start gap-4 mb-6">
                <div className="w-24 h-36 relative flex-shrink-0">
                  <Image
                    src={getTMDBImageUrl(movie.thumbnailUrl)}
                    alt={movie.title}
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{movie.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">
                    {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'} • {movie.genre?.name || 'Unknown Genre'}
                  </p>
                  <p className="text-sm text-gray-300 line-clamp-2 mb-2">{movie.description}</p>
                  <div className="mt-2">
                    <PricingDisplay pricing={pricing} />
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-4 mt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>${finalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-700">
                  <span>Total</span>
                  <span>${finalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Method */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              
              <div className="space-y-4 mb-6">
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
                
                <label className="flex items-center space-x-3 p-3 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="apple_pay"
                    checked={paymentMethod === 'apple_pay'}
                    onChange={() => setPaymentMethod('apple_pay')}
                    className="form-radio text-red-600"
                  />
                  <span>Apple Pay</span>
                </label>
              </div>
              
              <button
                onClick={handlePurchase}
                disabled={isProcessing}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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