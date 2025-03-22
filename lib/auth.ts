import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from './config.server'
import { dbClient } from './internal/db-client'
export async function getServerSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')
    if (!session) {
      return null
    }

  const decoded = jwt.verify(session.value, JWT_SECRET)
  const user = await dbClient.user.findUnique({
    where: {
      //@ts-ignore
      id: decoded.userId,
    },
  })
  return user
}
