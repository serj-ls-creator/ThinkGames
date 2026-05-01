import './globals.css'
import { AuthProvider } from '../src/context/AuthContext'

export const metadata = {
  title: 'ThinkGames - Освітні ігри для дітей',
  description: 'Освітній додаток для дітей 8-12 років для вивчення математики через ігри',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/android-chrome-192x192.png',
    apple: '/icons/apple-touch-icon.png',
  },
}

export const viewport = {
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <body className="font-rounded antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
