import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookStore = await cookies()
  cookStore.delete('session')
  cookStore.delete('next-auth.csrf-token')
  cookStore.delete('next-auth.callback-url')
  return NextResponse.json({ message: 'Logged out' })
}
