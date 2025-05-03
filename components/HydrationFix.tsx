// components/HydrationFix.tsx
'use client'

import { useEffect, useState } from 'react'

export default function HydrationFix({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  return <>{children}</>
}