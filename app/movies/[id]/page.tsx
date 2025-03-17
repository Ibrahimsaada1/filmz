import { dbClient } from '@/lib/internal/db-client'
import { MovieDetailClient } from './MovieDetailClient'
import { getServerSession } from 'next-auth/next'
import { notFound } from 'next/navigation'

export default async function MovieDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const movieId = parseInt(params.id)

  if (isNaN(movieId)) {
    return notFound()
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
  const session = await getServerSession()

  if (session?.user?.email) {
    const user = await dbClient.user.findUnique({
      where: { email: session.user.email },
    })

    if (user) {
      const purchase = await dbClient.userPurchase.findFirst({
        where: {
          userId: user.id,
          movieId: movie.id,
        },
      })

      isPurchased = !!purchase
    }
  }

  return <MovieDetailClient movie={movie} isPurchased={isPurchased} />
}
