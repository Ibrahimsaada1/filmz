import { NextRequest, NextResponse } from 'next/server'
import { dbClient } from '@/lib/internal/db-client'

export async function GET(request: NextRequest) {
  try {
    // Simple query to test if Prisma is working
    const count = await dbClient.movie.count()
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      movieCount: count
    })
  } catch (error) {
    console.error('Database test failed:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Database connection failed', 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
} 