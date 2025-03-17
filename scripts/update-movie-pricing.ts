import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateMoviePricing() {
  try {
    // Get all movies that don't have pricing
    const movies = await prisma.movie.findMany({
      where: {
        pricing: null
      }
    })

    console.log(`Found ${movies.length} movies without pricing`)

    // Update each movie with random pricing
    for (const movie of movies) {
      const basePrice = (Math.floor(Math.random() * 6) + 9).toFixed(2) // Random price between $9.00 and $14.99
      const shouldDiscount = Math.random() > 0.7 // 30% chance of discount
      const discountPercent = shouldDiscount ? Math.floor(Math.random() * 30) + 10 : null // 10-40% discount

      await prisma.pricing.create({
        data: {
          movieId: movie.id,
          basePrice: parseFloat(basePrice),
          discountPercent: discountPercent,
          currency: 'USD',
        }
      })

      console.log(`Added pricing for movie: ${movie.title}`)
    }

    console.log('Pricing update complete!')
  } catch (error) {
    console.error('Error updating movie pricing:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateMoviePricing()
  .then(() => console.log('Script completed successfully'))
  .catch((error) => console.error('Script failed:', error)) 