import { dbClient } from '@/lib/internal/db-client'
import { MovieDetailClient } from './MovieDetailClient'
import { redirect, notFound } from 'next/navigation'
import { getServerSession } from '@/lib/auth'
import { Suspense } from 'react'

export default async function MovieDetailPage({
  params,
}: {
  params: { id: string }
}) {
  params = await params

  const movieId = parseInt(params.id)

  if (isNaN(movieId)) {
    return redirect('/login')
  }

  // Get the movie with its relations
  const movie = await dbClient.movie.findUnique({
    where: { id: movieId },
    include: {
      genre: true,
      pricing: true,
    },
  })

  if (!movie) {
    return notFound()
  }

  // Check if the user has purchased this movie
  let isPurchased = false
  const user = await getServerSession()
  if (!user) {
    return notFound()
  }

  if (user) {
    const purchase = await dbClient.userPurchase.findFirst({
      where: {
        userId: user.id,
        movieId: movie.id,
      },
      select: {
        id: true,
      },
    })
    isPurchased = !!purchase
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MovieDetailClient movie={movie} isPurchased={isPurchased} />
    </Suspense>
  )
}
