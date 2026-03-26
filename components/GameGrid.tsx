'use client'

import { Card } from './Card'
import { useGameStore } from '../store/useGameStore'

export const GameGrid: React.FC = () => {
  const { cards, flipCard, isChecking } = useGameStore()

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 max-w-2xl mx-auto">
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
