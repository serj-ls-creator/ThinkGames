'use client'

import { motion } from 'framer-motion'
import { useGameStore } from '../store/useGameStore'

interface Level {
  value: number
  label: string
  description: string
}

const levels: Level[] = [
  { value: 20, label: 'До 20', description: 'Легкий рівень' },
  { value: 50, label: 'До 50', description: 'Середній рівень' },
  { value: 100, label: 'До 100', description: 'Складний рівень' },
]

export const LevelSelector: React.FC = () => {
  const { level, setLevel } = useGameStore()

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
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
              onClick={() => setLevel(lvl.value)}
              className={`
                w-full p-6 rounded-xl border-2 transition-all duration-300
                ${level === lvl.value
                  ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-lg'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:shadow-md'
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
  )
}
