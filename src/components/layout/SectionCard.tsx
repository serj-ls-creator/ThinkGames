'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface SectionCardProps {
  title: string
  icon: string
  description: string
  progress: number
  color: string
  href: string
  games?: { name: string; href: string }[]
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  icon,
  description,
  progress,
  color,
  href,
  games = []
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link href={href}>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className={`h-2 bg-gradient-to-r ${color}`}></div>
          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{description}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">Прогрес</span>
                <span className="text-xs font-medium text-gray-700">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1 }}
                  className={`h-full bg-gradient-to-r ${color}`}
                />
              </div>
            </div>

            <button
              className={`w-full py-3 px-4 bg-gradient-to-r ${color} text-white font-bold rounded-xl hover:opacity-90 transition-opacity duration-200 flex items-center justify-center space-x-2`}
            >
              <span>Перейти →</span>
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
