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
    
    // Fetch all user purchases with movie details
    const purchases = await dbClient.userPurchase.findMany({
      where: {
        userId,
      },
      include: {
        movie: {
          include: {
            genre: true,
          },
        },
      },
      orderBy: {
        purchaseDate: 'desc',
      },
    })
    
    // Transform the data to include only necessary movie information
    const purchasedMovies = purchases.map((purchase) => ({
      id: purchase.movie.id,
      title: purchase.movie.title,
      thumbnailUrl: purchase.movie.thumbnailUrl,
      rating: purchase.movie.rating,
      genre: purchase.movie.genre?.name || 'Unknown',
      purchaseDate: purchase.purchaseDate,
      pricePaid: purchase.pricePaid,
      currency: purchase.currency,
    }))
    
    return NextResponse.json(purchasedMovies)
  } catch (error) {
    console.error('Error fetching user purchases:', error)
    return NextResponse.json(
      { error: 'Failed to fetch purchased movies' },
      { status: 500 }
    )
  }
} 