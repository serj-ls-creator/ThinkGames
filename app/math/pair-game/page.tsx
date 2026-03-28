'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LevelSelector } from '../../../src/components/ui/LevelSelector'
import { useGameStore } from '../../../store/useGameStore'

const levels = [
  { value: 20, label: 'До 20', description: 'Легкий рівень' },
  { value: 50, label: 'До 50', description: 'Середній рівень' },
  { value: 100, label: 'До 100', description: 'Складний рівень' },
]

const gridSizes = [
  { rows: 3, cols: 4, label: '3×4', description: '12 карток' },
  { rows: 4, cols: 4, label: '4×4', description: '16 карток' },
  { rows: 3, cols: 6, label: '3×6', description: '18 карток' },
]

export default function PairGameLevelPage() {
  const router = useRouter()
  // Достаем значения и экшены из стора
  const { level, gridSize, setLevel, setGridSize, initializeGame } = useGameStore()

  const handleStartGame = () => {
    initializeGame(level, gridSize)
    router.push('/math/pair-game/play')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEE9FF] via-[#F5F0FF] to-[#FAF5FF] px-4 py-8">
      {/* max-w-4xl ограничивает ширину, mx-auto центрирует сам контейнер */}
      <div className="max-w-4xl mx-auto flex flex-col items-center"> 
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Link
            href="/math"
            className="inline-flex items-center text-gray-600 hover:text-green-600 transition-colors mb-6 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md"
          >
            ← Назад до математики
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Знайди пару
          </h1>
          
          <p className="text-lg text-gray-600">
            Оберіть рівень складності та розмір поля
          </p>
        </motion.div>

        {/* LevelSelector */}
        <motion.div
          className="flex justify-center" // Добавляем центрирование родителю
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-full max-w-2xl mx-auto">
            <LevelSelector 
              levels={levels} 
              gridSizes={gridSizes} 
              colorTheme="purple"
              selectedLevelFromParent={level}
              selectedGridSizeFromParent={gridSize}
              onLevelSelect={(val) => setLevel(val)}
              onGridSizeSelect={(size) => setGridSize(size)}
            />
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-8"
        >
          <button
            onClick={handleStartGame}
            className="inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:from-green-600 hover:to-emerald-600"
          >
            Грати
          </button>
        </motion.div>
      </div>
    </div>
  )
}
