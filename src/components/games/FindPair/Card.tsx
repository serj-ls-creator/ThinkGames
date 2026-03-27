'use client'

import { motion } from 'framer-motion'
import { Card as CardType } from '../../../types'

interface CardProps {
  card: CardType
  onClick: () => void
  disabled: boolean
}

export const Card: React.FC<CardProps> = ({ card, onClick, disabled }) => {
  return (
    <motion.div
      className="relative aspect-square"
      whileHover={!disabled && !card.isFlipped ? { scale: 1.05 } : {}}
      whileTap={!disabled && !card.isFlipped ? { scale: 0.95 } : {}}
    >
      <div
        onClick={() => !disabled && !card.isFlipped && onClick()}
        className={`
          absolute inset-0 rounded-xl cursor-pointer transition-all duration-300 transform-gpu
          ${card.isFlipped || card.isMatched 
            ? 'bg-white border-2 border-gray-300' 
            : 'bg-gradient-to-br from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600'
          }
          ${card.isMatched ? 'opacity-60 cursor-default' : ''}
          ${disabled ? 'cursor-not-allowed' : ''}
        `}
      >
        <div className="absolute inset-0 flex items-center justify-center p-2 md:p-4">
          {card.isFlipped || card.isMatched ? (
            <motion.div
              initial={{ rotateY: 180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-lg md:text-3xl font-bold text-gray-800 text-center"
            >
              {card.content}
            </motion.div>
          ) : (
            <div className="text-2xl md:text-5xl text-white">?</div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
