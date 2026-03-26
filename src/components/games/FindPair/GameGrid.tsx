'use client'

import { Card } from './Card'
import { useGameStore } from '../../../store/useGameStore'

export const GameGrid: React.FC = () => {
  const { cards, flipCard, isChecking, gridSize } = useGameStore()

  const getGridClasses = () => {
    switch (`${gridSize.rows}x${gridSize.cols}`) {
      case '3x4':
        return 'grid-cols-3 md:grid-cols-4'
      case '4x4':
        return 'grid-cols-4'
      case '3x6':
        return 'grid-cols-3 md:grid-cols-6'
      default:
        return 'grid-cols-3 md:grid-cols-4'
    }
  }

  return (
    <div className={`grid ${getGridClasses()} gap-3 md:gap-4 max-w-4xl mx-auto`}>
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          onClick={() => flipCard(card.id)}
          disabled={isChecking}
        />
      ))}
    </div>
  )
}
