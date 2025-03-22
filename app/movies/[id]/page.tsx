import { dbClient } from '@/lib/internal/db-client'
import { MovieDetailClient } from './MovieDetailClient'
import { redirect, notFound } from 'next/navigation'
import { getServerSession } from '@/lib/auth'
import { Suspense } from 'react'
import { Film } from 'lucide-react'
import { Header } from '@/app/components/Header'

export const dynamic = 'force-dynamic'

export default async function MovieDetailPage({
  params: promiseParams,
}: {
  params: Promise<{ id: string }>
}) {
  const params = await promiseParams

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
    <Suspense
      fallback={
        <div>
          <div className="min-h-screen bg-gray-900 text-white">
            <Header />
            <div className="container mx-auto px-4 py-12">
              <div className="flex items-center mb-8">
                <Film className="w-6 h-6 text-red-600 mr-2" />
              </div>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <MovieDetailClient movie={movie} isPurchased={isPurchased} />
    </Suspense>
  )
}
