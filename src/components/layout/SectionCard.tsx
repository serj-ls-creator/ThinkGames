'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { SectionCardProps } from '../../types'

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  icon,
  description,
  progress,
  color,
  href,
  level,
  xp,
  games = []
}) => {
  const isImageIcon = icon.startsWith('/')

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
            <div className="flex items-start justify-between mb-3 gap-2">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white/70 ring-1 ring-black/5 flex-shrink-0">
                  {isImageIcon ? (
                    <img src={icon} alt="" className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <span className="text-3xl leading-none">{icon}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-800 truncate">{title}</h3>
                  <p className="text-sm text-gray-600 mt-1 truncate">{description}</p>
                </div>
              </div>
              {level && (
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-2 py-0.5 rounded-full text-[8px] font-bold leading-none whitespace-nowrap flex-shrink-0">
                  Lvl {level}
                </div>
              )}
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
              {xp && (
                <div className="mt-2 text-xs text-gray-600 text-center">
                  {xp} XP
                </div>
              )}
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
