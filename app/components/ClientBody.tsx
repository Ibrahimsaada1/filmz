'use client'

import { inter } from '@/app/fonts'

export default function ClientBody({ children }: { children: React.ReactNode }) {
  return (
    <div className={inter.className}>
      {children}
    </div>
  )
} 