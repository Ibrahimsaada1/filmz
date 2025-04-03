import React, { Suspense } from 'react'
import LibraryPageClient from './page-client'
import { redirect } from 'next/navigation'
import Loader from '../components/Loader'
import { getServerSession } from '@/lib/auth'

export default async function LibraryPage() {
  const session = await getServerSession()
  if (!session) {
    redirect('/login')
  }
  return (
    <Suspense fallback={<Loader />}>
      <LibraryPageClient />
    </Suspense>
  )
}
