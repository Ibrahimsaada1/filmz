import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import LoginPageClient from './pageClient'

export default async function LoginPage({
  searchParams: promiseSearchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await promiseSearchParams
  const session = await getServerSession()
  if (session) {
    return redirect('/movies')
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageClient searchParams={searchParams} />
    </Suspense>
  )
}
