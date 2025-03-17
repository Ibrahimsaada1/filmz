import { NextRequest, NextResponse } from 'next/server'
import { dbClient } from '@/lib/internal/db-client'

export async function GET(request: NextRequest) {
  try {
    console.log('Movies API route called')
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const genre = searchParams.get('genre')
    const pageSize = 20 // Number of movies per page
    
    console.log('Query params:', { page, genre, pageSize })
    
    // Calculate skip value for pagination
    const skip = (page - 1) * pageSize
    
    // Build where clause - simplify to ensure we get results
    const where: any = {}
    
    // Add genre filter if provided and valid
    if (genre && genre !== 'featured' && !isNaN(parseInt(genre))) {
      where.genreId = parseInt(genre)
    }
    
    console.log('Executing count query with where:', where)
    
    // Get total count for pagination
    const totalCount = await dbClient.movie.count({ where })
    
    console.log('Total count:', totalCount)
    
    // Calculate total pages
    const totalPages = Math.ceil(totalCount / pageSize) || 1 // Ensure at least 1 page
    
    console.log('Executing findMany query')
    
    // Fetch movies with pagination - simplify include to avoid issues
    const movies = await dbClient.movie.findMany({
      skip,
      take: pageSize,
      where,
      include: {
        genre: true,
      },
      orderBy: {
        id: 'desc', // Simple ordering to avoid issues
      },
    })
    
    console.log(`Found ${movies.length} movies`)
    
    // Add default pricing if not present
    const processedMovies = movies.map(movie => ({
      ...movie,
      pricing: {
        basePrice: 9.99,
        discountPercent: 0,
        currency: 'USD'
      }
    }))
    
    const response = {
      results: processedMovies,
      page,
      total_pages: totalPages,
      total_results: totalCount,
    }
    
    console.log('Sending response with', processedMovies.length, 'movies')
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching movies:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch movies', 
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 