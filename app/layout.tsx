import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ThinkGames - Освітні ігри для дітей',
  description: 'Освітній додаток для дітей 8-12 років для вивчення математики через ігри',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          {children}
        </div>
      </body>
    </html>
  )
}
