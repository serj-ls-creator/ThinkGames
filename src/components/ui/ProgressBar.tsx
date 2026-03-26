'use client'

import { motion } from 'framer-motion'
import { ProgressBarProps } from '../../types'

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  color = 'bg-gradient-to-r from-purple-500 to-purple-600',
  height = 'h-2',
  showLabel = false
}) => {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100))

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500">Прогрес</span>
          <span className="text-xs font-medium text-gray-700">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full ${height} bg-gray-100 rounded-full overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.3 }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  )
}
