'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card } from './Card'
import { GameGrid } from './GameGrid'
import { useGameStore } from '../../../store/useGameStore'
import { saveGameResult } from '../../../lib/points'
import { calculateScore } from '../../../lib/generatePairs'
import { getSessionId } from '../../../lib/utils'
import { useAuth } from '../../../context/AuthContext'

export const FindPairGame: React.FC = () => {
  const { user } = useAuth()
  const {
    cards,
    matchedPairs,
    moves,
    level,
    gridSize,
    gameCompleted,
    initializeGame,
    resetGame,
  } = useGameStore()

  const [isSaving, setIsSaving] = useState(false)
  const hasSaved = useRef(false) // Защита от множественных сохранений

  useEffect(() => {
    if (!cards.length) {
      initializeGame(level, gridSize)
    }
  }, [cards.length, initializeGame, level, gridSize])

  useEffect(() => {
    if (gameCompleted && !isSaving) {
      handleGameComplete()
    }
  }, [gameCompleted, isSaving])

  const handleGameComplete = async () => {
    if (hasSaved.current) return; // Защита от множественных вызовов
    
    setIsSaving(true)
    hasSaved.current = true
    
    try {
      if (user?.id) {
        await saveGameResult(user.id, 'math', 10, false) // Фиксированные 10 очков
        console.log('!!! FIND PAIR GAME COMPLETE: 10 XP SENT !!!');
      } else {
        console.log('Анонимный игрок: очки не сохранены')
      }
    } catch (error) {
      console.error('Failed to save game progress:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleResetGame = () => {
    resetGame()
    initializeGame(level, gridSize)
    hasSaved.current = false // Сброс флага сохранения
  }

  return (
    <div className="min-h-screen px-2 py-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4"
        >
          <Link
            href="/math/find-pair"
            className="inline-flex items-center text-gray-600 hover:text-green-600 transition-colors mb-2 text-sm"
          >
            ← Назад до налаштувань
          </Link>
        </motion.div>

        <div className="text-center mb-4">
          <h2 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Знайди пару
          </h2>
          <div className="text-xs text-gray-600 mb-1">
            Знайдено: <span className="font-bold text-green-600">{matchedPairs}</span> / {(gridSize.rows * gridSize.cols) / 2}
          </div>
          <div className="text-xs text-gray-600">
            Ходів: <span className="font-bold text-green-600">{moves}</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-4"
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
              Результат: <span className="font-bold text-green-600">{calculateScore(moves, level, gridSize)}</span> очок
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleResetGame}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Грати знову
              </button>
              
              <Link
                href="/math/find-pair"
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
