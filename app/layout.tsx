import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

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
    <html lang="uk" className={inter.variable}>
      <body className="font-rounded antialiased">
        {children}
      </body>
    </html>
  )
}
