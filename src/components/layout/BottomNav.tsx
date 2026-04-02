'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { id: 'home', label: 'Головна', icon: '🏠', href: '/' },
  { id: 'games', label: 'Ігри', icon: '🎮', href: '/math' },
  { id: 'leaderboard', label: 'Leaderboard', icon: '🏆', href: '/leaderboard' },
  { id: 'profile', label: 'Профіль', icon: '👤', href: '/profile' }
] as const

export const BottomNav: React.FC = () => {
  const pathname = usePathname()

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white px-4 py-2"
    >
      <div className="mx-auto max-w-sm">
        <div className="flex items-center justify-around">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link key={item.id} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`flex flex-col items-center rounded-lg p-2 transition-colors duration-200 ${
                    isActive ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <div className="mb-1 text-2xl">{item.icon}</div>
                  <div className="text-xs font-medium">{item.label}</div>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
