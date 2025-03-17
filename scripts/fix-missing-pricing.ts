import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixMissingPricing() {
  try {
    // Find all movies without pricing
    const moviesWithoutPricing = await prisma.movie.findMany({
      where: {
        pricing: null
      }
    })
    
    console.log(`Found ${moviesWithoutPricing.length} movies without pricing`)
    
    // Add fixed pricing to each movie
    for (const movie of moviesWithoutPricing) {
      await prisma.pricing.create({
        data: {
          movieId: movie.id,
          basePrice: 9.99, // Fixed price
          currency: 'USD'
        }
      })
      
      console.log(`Added fixed pricing for "${movie.title}": $9.99`)
    }
    
    console.log('Fixed all movies without pricing!')
  } catch (error) {
    console.error('Error fixing missing pricing:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixMissingPricing()
  .then(() => console.log('Script completed successfully'))
  .catch(error => console.error('Script failed:', error)) 