'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Level {
  value: number
  label: string
  description: string
}

interface GridSize {
  rows: number
  cols: number
  label: string
  description: string
}

interface LevelSelectorProps {
  levels: Level[]
  gridSizes?: GridSize[]
  colorTheme: 'purple' | 'orange' | 'green'
  onLevelSelect?: (level: number) => void
  onGridSizeSelect?: (gridSize: { rows: number; cols: number }) => void
}

const colorThemes = {
  purple: {
    selected: 'border-purple-500 bg-purple-50 text-purple-700',
    default: 'border-gray-200 bg-white text-gray-700 hover:border-purple-300'
  },
  orange: {
    selected: 'border-orange-500 bg-orange-50 text-orange-700',
    default: 'border-gray-200 bg-white text-gray-700 hover:border-orange-300'
  },
  green: {
    selected: 'border-green-500 bg-green-50 text-green-700',
    default: 'border-gray-200 bg-white text-gray-700 hover:border-green-300'
  }
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({ 
  levels, 
  gridSizes = [],
  colorTheme = 'purple',
  onLevelSelect,
  onGridSizeSelect
}) => {
  const [selectedLevel, setSelectedLevel] = useState<number>(levels[0]?.value || 1)
  const [selectedGridSize, setSelectedGridSize] = useState<{ rows: number; cols: number }>(
    gridSizes[0] || { rows: 3, cols: 4 }
  )
  const theme = colorThemes[colorTheme]

  const handleLevelClick = (level: number) => {
    setSelectedLevel(level)
    onLevelSelect?.(level)
  }

  const handleGridSizeClick = (gridSize: { rows: number; cols: number }) => {
    setSelectedGridSize(gridSize)
    onGridSizeSelect?.(gridSize)
  }

  return (
    <div className="space-y-8">
      {/* Уровень сложности */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Оберіть рівень складності
        </h2>
        
        <div className="grid gap-4 md:grid-cols-3 max-w-2xl mx-auto">
          {levels.map((lvl, index) => (
            <motion.div
              key={lvl.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => handleLevelClick(lvl.value)}
                className={`
                  w-full p-6 rounded-xl border-2 transition-all duration-300
                  ${selectedLevel === lvl.value
                    ? theme.selected
                    : theme.default
                  }
                `}
              >
                <div className="text-xl font-bold mb-2">{lvl.label}</div>
                <div className="text-sm opacity-75">{lvl.description}</div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Размер поля */}
      {gridSizes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Розмір поля
          </h2>
          
          <div className="grid gap-4 md:grid-cols-3 max-w-2xl mx-auto">
            {gridSizes.map((size, index) => (
              <motion.div
                key={`${size.rows}x${size.cols}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => handleGridSizeClick({ rows: size.rows, cols: size.cols })}
                  className={`
                    w-full p-6 rounded-xl border-2 transition-all duration-300
                    ${selectedGridSize.rows === size.rows && selectedGridSize.cols === size.cols
                      ? theme.selected
                      : theme.default
                    }
                  `}
                >
                  <div className="text-xl font-bold mb-2">{size.label}</div>
                  <div className="text-sm opacity-75">{size.description}</div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
