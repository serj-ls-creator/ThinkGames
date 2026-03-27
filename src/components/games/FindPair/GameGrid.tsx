'use client'

import { Card } from './Card'
import { useGameStore } from '../../../store/useGameStore'

export const GameGrid: React.FC = () => {
  const { cards, flipCard, isChecking, gridSize } = useGameStore()

  const getGridClasses = () => {
    switch (`${gridSize.rows}x${gridSize.cols}`) {
      case '3x4':
        return 'grid-cols-3'
      case '4x4':
        return 'grid-cols-4'
      case '3x6':
        return 'grid-cols-3'
      default:
        return 'grid-cols-3'
    }
  }

  return (
    <div className={`grid ${getGridClasses()} gap-1 max-w-4xl mx-auto`}>
      {cards.map((card) => (
        <div key={card.id} className="min-w-0 flex-shrink-0" style={{ minWidth: '60px' }}>
          <Card
            card={card}
            onClick={() => flipCard(card.id)}
            disabled={isChecking}
          />
        </div>
      ))}
    </div>
  )
}
