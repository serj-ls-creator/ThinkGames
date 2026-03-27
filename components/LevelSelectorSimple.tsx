'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Level {
  value: number
  label: string
  description: string
}

interface LevelSelectorSimpleProps {
  levels: Level[]
  colorTheme: 'purple' | 'orange'
  onLevelSelect: (level: number) => void
}

const colorThemes = {
  purple: {
    selected: 'border-purple-500 bg-purple-50 text-purple-700',
    default: 'border-gray-200 bg-white text-gray-700 hover:border-purple-300'
  },
  orange: {
    selected: 'border-orange-500 bg-orange-50 text-orange-700',
    default: 'border-gray-200 bg-white text-gray-700 hover:border-orange-300'
  }
}

export const LevelSelectorSimple: React.FC<LevelSelectorSimpleProps> = ({ 
  levels, 
  colorTheme = 'purple',
  onLevelSelect 
}) => {
  const [selectedLevel, setSelectedLevel] = useState<number>(levels[0]?.value || 1)
  const theme = colorThemes[colorTheme]

  return (
    <div className="space-y-5">
      <h2 className="text-center text-xl font-semibold text-gray-800 sm:text-2xl">
        Оберіть рівень складності
      </h2>
      
      <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {levels.map((level, index) => (
          <motion.div
            key={level.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={() => {
                setSelectedLevel(level.value)
                onLevelSelect(level.value)
              }}
              className={`
                w-full rounded-xl border-2 p-4 transition-all duration-300 sm:p-5
                ${selectedLevel === level.value
                  ? theme.selected
                  : theme.default
                }
              `}
            >
              <div className="mb-1 text-lg font-bold sm:mb-2 sm:text-xl">{level.label}</div>
              <div className="text-xs opacity-75 sm:text-sm">{level.description}</div>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
