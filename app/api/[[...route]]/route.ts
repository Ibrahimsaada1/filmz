import { NextRequest, NextResponse } from 'next/server'

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(_: NextRequest) {
  const response = new NextResponse(null, {
    status: 200,
  })
  
  // Set CORS headers
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Allow-Origin', '*') // Adjust in production
  response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
  response.headers.set(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  )
  
  return response
} 