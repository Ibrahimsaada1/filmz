import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { NextApiRequest, NextApiResponse } from 'next'

// List of allowed origins (you can add more as needed)
const allowedOrigins = [
  'http://localhost:3000',
  'http://192.168.1.73:3000',
  process.env.NEXT_PUBLIC_APP_URL,
].filter(Boolean)

/**
 * Middleware to handle CORS for API routes
 */
export function corsMiddleware(request: NextRequest) {
  // Get the origin from the request headers
  const origin = request.headers.get('origin') || ''
  
  // Check if the origin is allowed
  const isAllowedOrigin = allowedOrigins.includes(origin)
  
  // Options for the response headers
  const headers = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
  }
  
  // If the origin is allowed, add it to the allowed origins header
  if (isAllowedOrigin) {
    headers['Access-Control-Allow-Origin'] = origin
  }
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return NextResponse.json({}, { headers })
  }
  
  // For actual requests, we'll add the headers in the route handlers
  return null
}

/**
 * Add CORS headers to a response
 */
export function addCorsHeaders(response: NextResponse, request: Request) {
  const origin = request.headers.get('origin') || ''
  const isAllowedOrigin = allowedOrigins.includes(origin)
  
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }
  
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  return response
}

export function corsMiddlewareApi(
  req: NextApiRequest,
  res: NextApiResponse,
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*') // In production, replace with specific domains
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  )

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Continue with the API handler
  return handler(req, res)
} 