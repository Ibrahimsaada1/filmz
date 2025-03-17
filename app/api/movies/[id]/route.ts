import { NextRequest, NextResponse } from 'next/server'
import { dbClient } from '@/lib/internal/db-client'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  params = await params
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid movie ID' }, { status: 400 })
    }

    const movie = await dbClient.movie.findUnique({
      where: { id },
      include: {
        genre: true,
        pricing: true,
      },
    })

    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 })
    }

    return NextResponse.json(movie)
  } catch (error) {
    console.error('Error fetching movie:', error)
    return NextResponse.json(
      { error: 'Failed to fetch movie details' },
      { status: 500 },
    )
  }
}
