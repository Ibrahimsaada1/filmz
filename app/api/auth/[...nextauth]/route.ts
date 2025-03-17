import { getServerSession } from '@/lib/auth'
import { NextResponse } from 'next/server'

const handler = async () => {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ session })
}

export { handler as GET, handler as POST }
