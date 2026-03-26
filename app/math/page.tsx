'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { LevelSelector } from '../../components/LevelSelector'
import { useGameStore } from '../../store/useGameStore'

export default function MathPage() {
  const { level, initializeGame } = useGameStore()

  const handleStartGame = () => {
    initializeGame(level)
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors mb-4"
          >
            ← Назад до головної
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
            Математика
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <LevelSelector />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-8"
        >
          <Link
            href="/math/pair-game"
            onClick={handleStartGame}
            className="inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:from-green-600 hover:to-emerald-600"
          >
            Грати
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
