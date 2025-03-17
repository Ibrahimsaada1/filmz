'use client'

export function PricingDebug({ movie }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
      <h3 className="text-xl font-bold mb-2">Pricing Debug</h3>
      <pre className="text-xs overflow-auto bg-gray-900 p-2 rounded">
        {JSON.stringify(movie, null, 2)}
      </pre>
    </div>
  )
} 