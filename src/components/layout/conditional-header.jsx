'use client'

import { usePathname } from 'next/navigation'
import { SiteHeader } from './site-header'
import { TransparentHeader } from './transparent-header'

export function ConditionalHeader() {
  const pathname = usePathname()
  const pathsWithoutDefaultHeader = [
    '/program',
    '/repertoar/',
  ]

  if (pathsWithoutDefaultHeader.some(path => pathname.startsWith(path))) {
    return <TransparentHeader />
  }

  return <SiteHeader />
}
