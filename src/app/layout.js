import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from './components/seat-map/layout/header'
import { Footer } from './components/seat-map/layout/footer'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata = {
  title: {
    default: 'МДТ "Константин Кисимов"',
    template: '%s | МДТ "Константин Кисимов"'
  },
  description: 'Музикално-драматичен театър "Константин Кисимов" - Велико Търново',
  keywords: ['театър', 'спектакли', 'култура', 'Велико Търново'],
  authors: [{ name: 'Theater Team' }],
  openGraph: {
    type: 'website',
    locale: 'bg_BG',
    url: 'https://theater-website.com',
    siteName: 'МДТ Константин Кисимов',
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="bg" className="scroll-smooth">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}