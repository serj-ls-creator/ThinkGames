'use client'

import { motion } from 'framer-motion'
import { useGameStore } from '../store/useGameStore'

interface HeaderProps {
  title: string
  showProgress?: boolean
}

export const Header: React.FC<HeaderProps> = ({ title, showProgress = false }) => {
  const { matchedPairs, gridSize } = useGameStore()
  const totalPairs = (gridSize.rows * gridSize.cols) / 2

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-8"
    >
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
        {title}
      </h1>
      
      {showProgress && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 font-medium"
        >
          Знайдено: <span className="text-primary-600 font-bold">{matchedPairs}</span> / {totalPairs}
        </motion.div>
      )}
    </motion.div>
  )
}
