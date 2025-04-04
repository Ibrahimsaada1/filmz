import { Suspense } from 'react'
import Link from 'next/link'
import { Header } from '@/app/components/Header'
import { MovieCard } from '@/app/components/MovieCard'
import { dbClient } from '@/lib/internal/db-client'
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth'
import Loader from '../components/Loader'
export default async function FavoritesPage() {
  // Check if user is authenticated
  const user = await getServerSession()

  if (!user) {
    // Redirect to login if not authenticated
    redirect('/login?callbackUrl=/favorites')
  }
  // Get user's favorite movies
  const favorites = await dbClient!.userLike.findMany({
    where: { userId: user.id },
    include: {
      movie: {
        include: {
          genre: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Extract movies from favorites
  const favoriteMovies = favorites.map((favorite) => favorite.movie)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Favorites</h1>

        <Suspense fallback={<Loader />}>
          {favoriteMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {favoriteMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-6">
                You haven&apos;t added any movies to your favorites yet.
              </p>
              <Link
                href="/movies"
                className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-md transition-colors"
              >
                Browse Movies
              </Link>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  )
}
