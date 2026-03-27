'use client'

import { motion } from 'framer-motion'
import { useGameStore } from '../store/useGameStore'

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

const levels: Level[] = [
  { value: 20, label: 'До 20', description: 'Легкий рівень' },
  { value: 50, label: 'До 50', description: 'Середній рівень' },
  { value: 100, label: 'До 100', description: 'Складний рівень' },
]

const gridSizes: GridSize[] = [
  { rows: 3, cols: 4, label: '3×4', description: '12 карток' },
  { rows: 4, cols: 4, label: '4×4', description: '16 карток' },
  { rows: 3, cols: 6, label: '3×6', description: '18 карток' },
]

export const LevelSelector: React.FC = () => {
  const { level, setLevel, gridSize, setGridSize } = useGameStore()

  return (
    <div className="space-y-8">
      {/* Уровень сложности */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Оберіть рівень складності
        </h2>
        
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
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
                onClick={() => setLevel(lvl.value)}
                className={`
                  w-full rounded-xl border-2 p-4 transition-all duration-300 sm:p-5
                  ${level === lvl.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-lg'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:shadow-md'
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
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Розмір поля
        </h2>
        
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
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
                onClick={() => setGridSize({ rows: size.rows, cols: size.cols })}
                className={`
                  w-full rounded-xl border-2 p-4 transition-all duration-300 sm:p-5
                  ${gridSize.rows === size.rows && gridSize.cols === size.cols
                    ? 'border-secondary-500 bg-secondary-50 text-secondary-700 shadow-lg'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-secondary-300 hover:shadow-md'
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
    </div>
  )
}
