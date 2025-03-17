'use client'

export function PricingDisplay({ pricing, className = '' }) {
  if (!pricing) {
    pricing = { basePrice: 9.99, currency: 'USD' }
  }
  
  const hasDiscount = pricing.discountPercent > 0
  const discountPrice = hasDiscount 
    ? pricing.basePrice * (1 - pricing.discountPercent / 100)
    : null
    
  return (
    <div className={`pricing-display ${className}`}>
      {hasDiscount ? (
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="text-gray-400 line-through text-lg mr-2">
              ${pricing.basePrice.toFixed(2)}
            </span>
            <span className="text-3xl font-bold text-white">
              ${discountPrice.toFixed(2)}
            </span>
            <span className="ml-2 text-sm bg-red-600 text-white px-2 py-1 rounded">
              {pricing.discountPercent}% OFF
            </span>
          </div>
          <span className="text-gray-400 text-sm mt-1">
            Limited time offer
          </span>
        </div>
      ) : (
        <span className="text-3xl font-bold text-white">
          ${pricing.basePrice.toFixed(2)}
        </span>
      )}
    </div>
  )
} 