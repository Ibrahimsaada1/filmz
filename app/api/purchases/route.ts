import { NextRequest, NextResponse } from 'next/server'
import { dbClient } from '@/lib/internal/db-client'
import { verifyAuth } from '@/lib/auth/auth-utils'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth()
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      )
    }

    const { userId } = authResult
    const { movieId, price, paymentMethod } = await request.json()

    // Validate input
    if (!movieId || !price || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    // Check if movie exists
    const movie = await dbClient.movie.findUnique({
      where: { id: movieId },
    })

    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 })
    }

    console.error({ userId, movieId, price, paymentMethod })
    // Create purchase record
    const purchase = await dbClient.userPurchase.create({
      data: {
        movieId,
        userId,
        paymentMethod,
        pricePaid: price,
        currency: 'USD',
        transactionId: crypto.randomUUID(),
      },
    })

    return NextResponse.json({
      success: true,
      orderId: purchase.id,
      message: 'Purchase completed successfully',
    })
  } catch (error) {
    console.error('Purchase error:', error)
    return NextResponse.json(
      { error: 'Failed to process purchase' },
      { status: 500 },
    )
  }
}
