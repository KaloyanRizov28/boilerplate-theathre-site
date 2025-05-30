import { Sofia_Sans } from 'next/font/google'
import './globals.css'
import { Footer } from './components/layout/footer'
import { ConditionalDefaultHeader } from './components/layout/contidionalHeader'
const sofiaSans = Sofia_Sans({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  display: 'swap',
  variable: '--font-sofia-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
})

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
    <html lang="bg" className={`scroll-smooth ${sofiaSans.variable}`}>
      <body className={`${sofiaSans.className} bg-theater-dark text-white antialiased`}>
        <div className="min-h-screen flex flex-col">
          <ConditionalDefaultHeader/>
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}