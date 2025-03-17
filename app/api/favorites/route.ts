import { NextRequest, NextResponse } from 'next/server'
import { dbClient } from '@/lib/internal/db-client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Get user ID from session
    const user = await dbClient.user.findUnique({
      where: { email: session.user.email as string }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Get movie ID from request body
    const { movieId } = await request.json()
    
    if (!movieId) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      )
    }
    
    // Check if movie exists
    const movie = await dbClient.movie.findUnique({
      where: { id: parseInt(movieId) }
    })
    
    if (!movie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      )
    }
    
    // Check if user already liked this movie
    const existingLike = await dbClient.userLike.findFirst({
      where: {
        userId: user.id,
        movieId: movie.id
      }
    })
    
    let result
    
    if (existingLike) {
      // If like exists, remove it (unlike)
      result = await dbClient.userLike.delete({
        where: { id: existingLike.id }
      })
      
      return NextResponse.json({
        message: 'Movie removed from favorites',
        liked: false
      })
    } else {
      // If like doesn't exist, create it (like)
      result = await dbClient.userLike.create({
        data: {
          userId: user.id,
          movieId: movie.id
        }
      })
      
      return NextResponse.json({
        message: 'Movie added to favorites',
        liked: true
      })
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
    return NextResponse.json(
      { error: 'Failed to update favorites' },
      { status: 500 }
    )
  }
}

// GET endpoint to check if a movie is favorited
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ liked: false })
    }
    
    // Get user ID from session
    const user = await dbClient.user.findUnique({
      where: { email: session.user.email as string }
    })
    
    if (!user) {
      return NextResponse.json({ liked: false })
    }
    
    // Get movie ID from query params
    const { searchParams } = new URL(request.url)
    const movieId = searchParams.get('movieId')
    
    if (!movieId) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      )
    }
    
    // Check if user already liked this movie
    const existingLike = await dbClient.userLike.findFirst({
      where: {
        userId: user.id,
        movieId: parseInt(movieId)
      }
    })
    
    return NextResponse.json({ liked: !!existingLike })
  } catch (error) {
    console.error('Error checking favorite status:', error)
    return NextResponse.json({ liked: false })
  }
} 