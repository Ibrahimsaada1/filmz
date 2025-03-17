import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addPricingToMovies() {
  try {
    // Get all movies without pricing
    const moviesWithoutPricing = await prisma.movie.findMany({
      where: {
        pricing: null
      }
    })
    
    console.log(`Found ${moviesWithoutPricing.length} movies without pricing`)
    
    // Add pricing to each movie
    for (const movie of moviesWithoutPricing) {
      // Generate random price between $9.00 and $14.99
      const basePrice = parseFloat((Math.floor(Math.random() * 6) + 9).toFixed(2))
      
      // 30% chance of discount
      const shouldDiscount = Math.random() > 0.7
      const discountPercent = shouldDiscount ? Math.floor(Math.random() * 30) + 10 : null
      
      await prisma.pricing.create({
        data: {
          movieId: movie.id,
          basePrice,
          discountPercent,
          currency: 'USD'
        }
      })
      
      console.log(`Added pricing for "${movie.title}": $${basePrice}${discountPercent ? ` (${discountPercent}% off)` : ''}`)
    }
    
    console.log('Pricing update complete!')
  } catch (error) {
    console.error('Error adding pricing to movies:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addPricingToMovies()
  .then(() => console.log('Script completed successfully'))
  .catch(error => console.error('Script failed:', error)) 