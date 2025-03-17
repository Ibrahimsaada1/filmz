import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@/lib/config.server'

export async function verifyAuth(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { success: false, error: 'Missing or invalid token' }
    }
    
    const token = authHeader.split(' ')[1]
    if (!token) {
      return { success: false, error: 'Empty token' }
    }
    
    // Verify token
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      
      return {
        success: true,
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      }
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError)
      return { success: false, error: 'Invalid or expired token' }
    }
  } catch (error) {
    console.error('Auth verification error:', error)
    return { success: false, error: 'Authentication error' }
  }
} 