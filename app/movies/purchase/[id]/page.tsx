import { Suspense } from 'react'
import { Header } from '@/app/components/Header'
import PurchaseMoviePageClient from './pageClient'

export const dynamic = 'force-dynamic'

export default async function PurchaseMoviePage({
  params: promiseParams,
}: {
  params: Promise<{ id: string }>
}) {
  const params = await promiseParams

  const id = parseInt(params.id)

  return (
    <Suspense
      fallback={
        <div>
          <Header />
        </div>
      }
    >
      <PurchaseMoviePageClient params={params} />
    </Suspense>
  )
}
