import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

declare global {
  var prisma: PrismaClient | undefined
}

let dbClient: PrismaClient

if (process.env.NODE_ENV === 'production') {
  dbClient = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  dbClient = global.prisma
}

export { dbClient }
