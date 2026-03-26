'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Header } from '../../../components/Header'
import { GameGrid } from '../../../components/GameGrid'
import { useGameStore } from '../../../store/useGameStore'
import { saveGameProgress } from '../../../lib/supabaseClient'
import { calculateScore } from '../../../lib/generatePairs'
import { getSessionId } from '../../../lib/utils'

export default function PairGamePage() {
  const {
    cards,
    matchedPairs,
    moves,
    level,
    gameCompleted,
    initializeGame,
    resetGame,
  } = useGameStore()

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!cards.length) {
      initializeGame(level)
    }
  }, [cards.length, initializeGame, level])

  useEffect(() => {
    if (gameCompleted && !isSaving) {
      handleGameComplete()
    }
  }, [gameCompleted, isSaving])

  const handleGameComplete = async () => {
    setIsSaving(true)
    
    try {
      const sessionId = getSessionId()
      const score = calculateScore(moves, level)
      
      await saveGameProgress(sessionId, level, score)
    } catch (error) {
      console.error('Failed to save game progress:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleResetGame = () => {
    resetGame()
    initializeGame(level)
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <Link
            href="/math"
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors mb-4"
          >
            ← Назад до математики
          </Link>
        </motion.div>

        <Header title="Знайди пару" showProgress={true} />

        <div className="text-center mb-6">
          <div className="text-lg text-gray-600">
            Ходів: <span className="font-bold text-primary-600">{moves}</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <GameGrid />
        </motion.div>

        {gameCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <h2 className="text-3xl font-bold text-green-600 mb-4">
              🎉 Вітаю! Гру завершено!
            </h2>
            
            <div className="text-lg text-gray-600 mb-6">
              Результат: <span className="font-bold text-primary-600">{calculateScore(moves, level)}</span> очок
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleResetGame}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Грати знову
              </button>
              
              <Link
                href="/math"
                className="inline-block px-6 py-3 bg-gray-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-600"
              >
                Новий рівень
              </Link>
            </div>
          </motion.div>
        )}

        {!gameCompleted && (
          <div className="text-center">
            <button
              onClick={handleResetGame}
              className="px-6 py-3 bg-gray-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-600"
            >
              Почати знову
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
