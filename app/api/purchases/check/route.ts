import { NextRequest, NextResponse } from 'next/server'
import { dbClient } from '@/lib/internal/db-client'
import { verifyAuth } from '@/lib/auth/auth-utils'

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const { userId } = authResult
    const url = new URL(request.url)
    const movieId = url.searchParams.get('movieId')
    
    if (!movieId) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      )
    }
    
    // Check if user has purchased this movie
    const purchase = await dbClient.userPurchase.findFirst({
      where: {
        userId,
        movieId: parseInt(movieId),
      },
    })
    
    return NextResponse.json({
      purchased: !!purchase,
    })
  } catch (error) {
    console.error('Error checking purchase status:', error)
    return NextResponse.json(
      { error: 'Failed to check purchase status' },
      { status: 500 }
    )
  }
} 