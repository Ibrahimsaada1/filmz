import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

let dbClient: PrismaClient | undefined

if (process.env.APP_ENV === 'production') {
  dbClient = new PrismaClient()
} else {
  if (!dbClient) {
    dbClient = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    })
  }
}

export { dbClient }
