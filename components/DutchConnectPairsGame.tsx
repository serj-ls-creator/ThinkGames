'use client'

import { useEffect, useRef, useState } from 'react'
import { WordPair } from '../src/types'
import GameEndModal from '../src/components/GameEndModal'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { preloadSpeechVoices, speakText } from '../src/lib/speech'
import { saveGameResult } from '../src/lib/points'
import { useAuth } from '../src/context/AuthContext'

interface DutchConnectPairsGameProps {
  items: WordPair[]
  title: string
  category: 'math' | 'ukrainian' | 'dutch'
}

type CardState = {
  id: string
  content: string
  side: 'left' | 'right'
  pairId: string
  isSelected: boolean
  isMatched: boolean
  isError: boolean
}

export { DutchConnectPairsGame }

export default function DutchConnectPairsGame({
  items,
  title,
  category
}: DutchConnectPairsGameProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [cards, setCards] = useState<CardState[]>([])
  const hasSavedResult = useRef(false)

  const initializeGame = () => {
    const leftCards = items.map((item, index) => ({
      id: `left-${index}`,
      content: item.left,
      side: 'left' as const,
      pairId: `pair-${index}`,
      isSelected: false,
      isMatched: false,
      isError: false
    }))

    const rightCards = items.map((item, index) => ({
      id: `right-${index}`,
      content: item.right,
      side: 'right' as const,
      pairId: `pair-${index}`,
      isSelected: false,
      isMatched: false,
      isError: false
    }))

    const shuffledRight = [...rightCards].sort(() => Math.random() - 0.5)

    setCards([...leftCards, ...shuffledRight])
    setMatchedPairs(0)
    setMistakes(0)
    setSelectedLeft(null)
    setIsChecking(false)
    hasSavedResult.current = false
  }

  useEffect(() => {
    initializeGame()
  }, [items])

  useEffect(() => {
    return preloadSpeechVoices()
  }, [])

  useEffect(() => {
    if (matchedPairs !== items.length || items.length === 0 || !user?.id || hasSavedResult.current) {
      return
    }

    hasSavedResult.current = true

    const persistCompletion = async () => {
      try {
        await saveGameResult(user.id, category, 10, mistakes === 0)
      } catch (error) {
        hasSavedResult.current = false
        console.error('Failed to save dutch connect-pairs result:', error)
      }
    }

    void persistCompletion()
  }, [category, items.length, matchedPairs, mistakes, user?.id])

  const handleCardClick = (cardId: string) => {
    const card = cards.find((currentCard) => currentCard.id === cardId)
    if (!card || card.isMatched || isChecking) return

    if (card.side === 'left') {
      speakText(card.content, 'nl-NL')

      setCards((prev) =>
        prev.map((currentCard) =>
          currentCard.id === cardId
            ? { ...currentCard, isSelected: true, isError: false }
            : currentCard.side === 'left'
              ? { ...currentCard, isSelected: false, isError: false }
              : currentCard
        )
      )
      setSelectedLeft(cardId)
      return
    }

    if (card.side === 'right' && selectedLeft) {
      speakText(card.content, 'uk-UA')
      setIsChecking(true)

      const leftCard = cards.find((currentCard) => currentCard.id === selectedLeft)

      if (leftCard && leftCard.pairId === card.pairId) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((currentCard) =>
              currentCard.id === selectedLeft || currentCard.id === cardId
                ? { ...currentCard, isSelected: false, isMatched: true, isError: false }
                : currentCard
            )
          )
          setMatchedPairs((prev) => prev + 1)
          setSelectedLeft(null)
          setIsChecking(false)
        }, 500)

        return
      }

      setMistakes((prev) => prev + 1)
      setTimeout(() => {
        setCards((prev) =>
          prev.map((currentCard) =>
            currentCard.id === selectedLeft || currentCard.id === cardId
              ? { ...currentCard, isSelected: false, isError: true }
              : currentCard
          )
        )
        setSelectedLeft(null)
        setIsChecking(false)
      }, 1000)
    }
  }

  const leftCards = cards.filter((card) => card.side === 'left')
  const rightCards = cards.filter((card) => card.side === 'right')

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEE9FF] via-[#F5F0FF] to-[#FAF5FF] px-3 py-4 sm:px-4 sm:py-6">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 text-center sm:mb-7"
        >
          <h1 className="mb-2 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-2xl font-bold leading-tight text-transparent sm:mb-3 sm:text-3xl md:text-4xl">
            {title}
          </h1>

          <div className="text-sm font-medium text-gray-600 sm:text-base md:text-lg">
            Знайдено: <span className="font-bold text-primary-600">{matchedPairs}</span> /{' '}
            {items.length}
          </div>
        </motion.div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div className="space-y-2 sm:space-y-3">
            <h2 className="mb-4 text-center text-xl font-semibold text-gray-700">Ліва колонка</h2>
            {leftCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => handleCardClick(card.id)}
                  className={`
                    min-h-[3.25rem] w-full rounded-xl px-2 py-3 text-center text-sm font-medium leading-snug shadow-md transition-all duration-300 sm:min-h-[3.75rem] sm:rounded-2xl sm:px-3 sm:py-4 sm:text-base
                    ${
                      card.isMatched
                        ? 'bg-green-100 text-green-800 line-through opacity-75'
                        : card.isError
                          ? 'animate-shake border-2 border-red-400 bg-red-100 text-red-800'
                          : card.isSelected
                            ? 'border-2 border-purple-500 bg-purple-100 text-purple-800 shadow-lg'
                            : 'bg-white text-gray-800 hover:bg-gray-50 hover:shadow-lg'
                    }
                  `}
                  disabled={card.isMatched || isChecking}
                >
                  {card.content}
                </button>
              </motion.div>
            ))}
          </div>

          <div className="space-y-2 sm:space-y-3">
            <h2 className="mb-4 text-center text-xl font-semibold text-gray-700">Права колонка</h2>
            {rightCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => handleCardClick(card.id)}
                  className={`
                    min-h-[3.25rem] w-full rounded-xl px-2 py-3 text-center text-sm font-medium leading-snug shadow-md transition-all duration-300 sm:min-h-[3.75rem] sm:rounded-2xl sm:px-3 sm:py-4 sm:text-base
                    ${
                      card.isMatched
                        ? 'bg-green-100 text-green-800 line-through opacity-75'
                        : card.isError
                          ? 'animate-shake border-2 border-red-400 bg-red-100 text-red-800'
                          : card.isSelected
                            ? 'border-2 border-purple-500 bg-purple-100 text-purple-800 shadow-lg'
                            : 'bg-white text-gray-800 hover:bg-gray-50 hover:shadow-lg'
                    }
                  `}
                  disabled={card.isMatched || isChecking}
                >
                  {card.content}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        <GameEndModal
          isOpen={matchedPairs === items.length}
          isWon={true}
          onPlayAgain={initializeGame}
          onSelectLevel={() => router.push('/dutch/connect-pairs')}
          onMainMenu={() => router.push('/dutch')}
          title="Чудово!"
          winMessage="Гру завершено!"
          playAgainText="Ще раз"
          mainMenuText="В головне меню"
          hasLevels={true}
          levelSelectHref="/dutch/connect-pairs"
          showCurrentLevel={false}
        />
      </div>

      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-2px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(2px);
          }
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
