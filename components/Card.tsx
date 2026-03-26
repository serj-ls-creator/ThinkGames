'use client'

import { motion } from 'framer-motion'
import { Card as CardType } from '../store/useGameStore'
import { cn } from '../lib/utils'

interface CardProps {
  card: CardType
  onClick: () => void
  disabled?: boolean
}

export const Card: React.FC<CardProps> = ({ card, onClick, disabled = false }) => {
  const isDisabled = disabled || card.isMatched

  return (
    <motion.div
      className={cn(
        'relative aspect-square cursor-pointer rounded-xl transition-all duration-300',
        'hover:scale-105 active:scale-95',
        card.isFlipped || card.isMatched
          ? 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white'
          : 'bg-gradient-to-br from-accent-400 to-accent-500 hover:from-accent-300 hover:to-accent-400',
        card.isMatched && 'opacity-80 cursor-not-allowed',
        isDisabled && 'cursor-not-allowed'
      )}
      onClick={!isDisabled ? onClick : undefined}
      whileHover={!isDisabled ? { scale: 1.05 } : {}}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      animate={{
        rotateY: card.isFlipped || card.isMatched ? 0 : 180,
        scale: card.isMatched ? 0.95 : 1,
      }}
      transition={{
        rotateY: { duration: 0.6 },
        scale: { duration: 0.2 },
      }}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center backface-hidden">
        {card.isFlipped || card.isMatched ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-2xl md:text-3xl font-bold text-center p-2"
          >
            {card.content}
          </motion.div>
        ) : (
          <div className="text-4xl md:text-5xl font-bold text-white opacity-50">
            ?
          </div>
        )}
      </div>
      
      {card.isMatched && (
        <motion.div
          className="absolute inset-0 bg-green-500 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.div>
  )
}
