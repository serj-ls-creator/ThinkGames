'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { WordPair } from '../../../types'

interface ConnectPairGameProps {
  items: WordPair[]
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

export const ConnectPairGame: React.FC<ConnectPairGameProps> = ({ items, title }) => {
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
    <div className="min-h-screen bg-gradient-to-br from-[#EEE9FF] via-[#F5F0FF] to-[#FAF5FF] px-2 py-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          className="text-center mb-4"
        >
          <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
            {title}
          </h1>
          
          <div className="text-xs text-gray-600 font-medium">
            Знайдено: <span className="text-primary-600 font-bold">{matchedPairs}</span> / {items.length}
          </div>
        </div>

        {/* Game Board */}
        <div className="flex gap-1 mb-2" style={{ height: '70vh', maxHeight: '70vh', width: '144px', minWidth: '144px', maxWidth: '144px', margin: '0 auto' }}>
          {/* Left Column */}
          <div className="space-y-1 min-w-0 flex-shrink-0 overflow-y-auto" style={{ width: '70px', minWidth: '70px', maxWidth: '70px' }}>
            <h2 className="text-xs font-semibold text-gray-7 mb-1 text-center">Ліва колонка</h2>
            {leftCards.map((card, index) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`
                    w-full p-0.5 rounded-lg shadow-sm transition-all duration-300 text-center font-medium text-xs overflow-hidden
                    ${card.isMatched 
                      ? 'bg-green-100 text-green-800 line-through opacity-75' 
                      : card.isError
                      ? 'bg-red-100 text-red-800 border-2 border-red-400 animate-pulse'
                      : card.isSelected
                      ? 'bg-purple-100 border-2 border-purple-500 text-purple-800 shadow-lg'
                      : 'bg-white hover:bg-gray-50 hover:shadow-lg text-gray-800'
                    }
                  `}
                  style={{ minWidth: '60px' }}
                  disabled={card.isMatched || isChecking}
                >
                  <span className="truncate">{card.content}</span>
                </button>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-1 min-w-0 flex-shrink-0 overflow-y-auto" style={{ width: '70px', minWidth: '70px', maxWidth: '70px' }}>
            <h2 className="text-xs font-semibold text-gray-700 mb-1 text-center">Права колонка</h2>
            {rightCards.map((card, index) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`
                    w-full p-0.5 rounded-lg shadow-sm transition-all duration-300 text-center font-medium text-xs overflow-hidden
                    ${card.isMatched 
                      ? 'bg-green-100 text-green-800 line-through opacity-75' 
                      : card.isError
                      ? 'bg-red-100 text-red-800 border-2 border-red-400 animate-pulse'
                      : card.isSelected
                      ? 'bg-purple-100 border-2 border-purple-500 text-purple-800 shadow-lg'
                      : 'bg-white hover:bg-gray-50 hover:shadow-lg text-gray-800'
                    }
                  `}
                  style={{ minWidth: '60px' }}
                  disabled={card.isMatched || isChecking}
                >
                  <span className="truncate">{card.content}</span>
                </button>
            ))}
          </div>
        </div>

        {/* Victory Screen */}
        {matchedPairs === items.length && (
          <div
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
          </div>
        )}
      </div>
    </div>
  )
}
