import { Suspense } from 'react'
import PurchaseSuccessPageClient from './pageClient'

export default async function PurchaseSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PurchaseSuccessPageClient />
    </Suspense>
  )
}
