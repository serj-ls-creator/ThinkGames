'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS } from '../../constants'

export const BottomNav: React.FC = () => {
  const pathname = usePathname()

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50"
    >
      <div className="max-w-sm mx-auto">
        <div className="flex justify-around items-center">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            
            return (
              <Link key={item.id} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`
                    flex flex-col items-center p-2 rounded-lg transition-colors duration-200
                    ${isActive 
                      ? 'text-purple-600' 
                      : 'text-gray-400 hover:text-gray-600'
                    }
                  `}
                >
                  <div className="text-2xl mb-1">{item.icon}</div>
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
