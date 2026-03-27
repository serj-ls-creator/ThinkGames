'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface PairItem {
  left: string
  right: string
}

interface ConnectPairsGameProps {
  items: PairItem[]
  title: string
}

interface CardState {
  id: string
  content: string
  side: 'left' | 'right'
  pairId: string
  isSelected: boolean
  isMatched: boolean
  isError: boolean
}

export const ConnectPairsGame: React.FC<ConnectPairsGameProps> = ({ items, title }) => {
  const [cards, setCards] = useState<CardState[]>([])
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    initializeGame()
  }, [items])

  const initializeGame = () => {
    const leftCards: CardState[] = items.map((item, index) => ({
      id: `left-${index}`,
      content: item.left,
      side: 'left' as const,
      pairId: `pair-${index}`,
      isSelected: false,
      isMatched: false,
      isError: false,
    }))

    const rightCards: CardState[] = items.map((item, index) => ({
      id: `right-${index}`,
      content: item.right,
      side: 'right' as const,
      pairId: `pair-${index}`,
      isSelected: false,
      isMatched: false,
      isError: false,
    }))

    // Shuffle right cards
    const shuffledRight = rightCards.sort(() => Math.random() - 0.5)
    
    setCards([...leftCards, ...shuffledRight])
    setMatchedPairs(0)
    setSelectedLeft(null)
    setIsChecking(false)
  }

  const handleCardClick = (cardId: string) => {
    const card = cards.find(c => c.id === cardId)
    if (!card || card.isMatched || isChecking) return

    if (card.side === 'left') {
      // Select left card
      setCards(prev => prev.map(c => 
        c.id === cardId 
          ? { ...c, isSelected: true }
          : c.side === 'left' 
            ? { ...c, isSelected: false }
            : c
      ))
      setSelectedLeft(cardId)
    } else if (card.side === 'right' && selectedLeft) {
      // Check match with selected left card
      setIsChecking(true)
      const leftCard = cards.find(c => c.id === selectedLeft)
      
      if (leftCard && leftCard.pairId === card.pairId) {
        // Correct match
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            (c.id === selectedLeft || c.id === cardId)
              ? { ...c, isSelected: false, isMatched: true }
              : c
          ))
          setMatchedPairs(prev => prev + 1)
          setSelectedLeft(null)
          setIsChecking(false)
        }, 500)
      } else {
        // Wrong match
        setCards(prev => prev.map(c => 
          c.id === cardId || c.id === selectedLeft
            ? { ...c, isError: true }
            : c
        ))
        
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === cardId || c.id === selectedLeft
              ? { ...c, isSelected: false, isError: false }
              : c
          ))
          setSelectedLeft(null)
          setIsChecking(false)
        }, 800)
      }
    }
  }

  const leftCards = cards.filter(c => c.side === 'left')
  const rightCards = cards.filter(c => c.side === 'right')

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEE9FF] via-[#F5F0FF] to-[#FAF5FF] px-3 py-4 sm:px-4 sm:py-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
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
            Знайдено: <span className="text-primary-600 font-bold">{matchedPairs}</span> / {items.length}
          </div>
        </motion.div>

        {/* Game Board */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {/* Left Column */}
          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Ліва колонка</h2>
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
                    ${card.isMatched 
                      ? 'bg-green-100 text-green-800 line-through opacity-75' 
                      : card.isError
                      ? 'bg-red-100 text-red-800 border-2 border-red-400 animate-shake'
                      : card.isSelected
                      ? 'bg-purple-100 border-2 border-purple-500 text-purple-800 shadow-lg'
                      : 'bg-white hover:bg-gray-50 hover:shadow-lg text-gray-800'
                    }
                  `}
                  disabled={card.isMatched || isChecking}
                >
                  {card.content}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Права колонка</h2>
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
                    ${card.isMatched 
                      ? 'bg-green-100 text-green-800 line-through opacity-75' 
                      : card.isError
                      ? 'bg-red-100 text-red-800 border-2 border-red-400 animate-shake'
                      : card.isSelected
                      ? 'bg-purple-100 border-2 border-purple-500 text-purple-800 shadow-lg'
                      : 'bg-white hover:bg-gray-50 hover:shadow-lg text-gray-800'
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

        {/* Victory Screen */}
        {matchedPairs === items.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-green-600 mb-4">
                Вітаю! Гру завершено!
              </h2>
              <p className="text-gray-600 mb-6">
                Ви знайшли всі {items.length} пар!
              </p>
              <button
                onClick={initializeGame}
                className="px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Грати знову
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
