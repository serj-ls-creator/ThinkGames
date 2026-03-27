'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Level, GridSizeOption, LevelSelectorProps } from '../../types'

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
        
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {levels.map((lvl: Level, index: number) => (
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
                  w-full rounded-xl border-2 p-4 transition-all duration-300 sm:p-5
                  ${selectedLevel === lvl.value
                    ? theme.selected
                    : theme.default
                  }
                `}
              >
                <div className="mb-1 text-lg font-bold sm:mb-2 sm:text-xl">{lvl.label}</div>
                <div className="text-xs opacity-75 sm:text-sm">{lvl.description}</div>
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
          
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {gridSizes.map((size: GridSizeOption, index: number) => (
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
                    w-full rounded-xl border-2 p-4 transition-all duration-300 sm:p-5
                    ${selectedGridSize.rows === size.rows && selectedGridSize.cols === size.cols
                      ? theme.selected
                      : theme.default
                    }
                  `}
                >
                  <div className="mb-1 text-lg font-bold sm:mb-2 sm:text-xl">{size.label}</div>
                  <div className="text-xs opacity-75 sm:text-sm">{size.description}</div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
