'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Level, GridSizeOption } from '../../types'

interface CompactLevelSelectorProps {
  levels: Level[]
  gridSizes?: GridSizeOption[]
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

export const CompactLevelSelector: React.FC<CompactLevelSelectorProps> = ({ 
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
    <div className="space-y-6">
      {/* Уровень сложности */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800 text-center mb-3">
          Оберіть рівень складності
        </h2>
        
        <div className="flex flex-wrap gap-2 justify-center">
          {levels.map((lvl: Level, index: number) => (
            <motion.button
              key={lvl.value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleLevelClick(lvl.value)}
              className={`
                py-3 px-4 rounded-xl border-2 transition-all duration-200
                ${selectedLevel === lvl.value
                  ? theme.selected
                  : theme.default
                }
              `}
            >
              <div className="text-sm font-bold">{lvl.label}</div>
              <div className="text-xs opacity-75">{lvl.description}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Размер поля */}
      {gridSizes.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 text-center mb-3">
            Розмір поля
          </h2>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {gridSizes.map((size: GridSizeOption, index: number) => (
              <motion.button
                key={`${size.rows}x${size.cols}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 + 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleGridSizeClick({ rows: size.rows, cols: size.cols })}
                className={`
                  py-3 px-4 rounded-xl border-2 transition-all duration-200
                  ${selectedGridSize.rows === size.rows && selectedGridSize.cols === size.cols
                    ? theme.selected
                    : theme.default
                  }
                `}
              >
                <div className="text-sm font-bold">{size.label}</div>
                <div className="text-xs opacity-75">{size.description}</div>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
