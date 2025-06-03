'use client'; // This component needs to be a Client Component

import { usePathname } from 'next/navigation';
import { Header } from './header';// Your actual default header component
import { TransparentHeader } from './transperantHeader';
export function ConditionalDefaultHeader() {
  const pathname = usePathname();

  // Define paths where the default header should NOT be shown
  // because another layout will provide a custom header.
  const pathsWithoutDefaultHeader = [
    '/calendar', // Example path for a page using TransparentHeader
    '/repertoar/',
  ];

  // If the current path is one of these, don't render the default header
  if (pathsWithoutDefaultHeader.some(path => pathname.startsWith(path))) {
    return <TransparentHeader/>;
  }

  return <Header />;
}