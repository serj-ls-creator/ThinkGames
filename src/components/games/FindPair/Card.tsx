'use client'

import { motion } from 'framer-motion'
import { Card as CardType } from '../../../types'

interface CardProps {
  card: CardType
  onClick: () => void
  disabled: boolean
}

export const Card: React.FC<CardProps> = ({ card, onClick, disabled }) => {
  const isFaceUp = card.isFlipped || card.isMatched

  return (
    <motion.div
      className="relative aspect-square min-w-0 overflow-visible"
      style={{ minWidth: '60px' }}
      whileHover={!disabled && !isFaceUp ? { scale: 1.04, y: -2 } : {}}
      whileTap={!disabled && !isFaceUp ? { scale: 0.97 } : {}}
    >
      <div
        className="relative h-full w-full"
        style={{ perspective: '1200px' }}
      >
        <motion.button
          type="button"
          onClick={() => !disabled && !isFaceUp && onClick()}
          animate={{ rotateY: isFaceUp ? 180 : 0 }}
          transition={{ duration: 0.16, ease: 'linear' }}
          className={`
            relative h-full w-full rounded-xl text-left transform-gpu [transform-style:preserve-3d]
            ${card.isMatched ? 'cursor-default opacity-70' : ''}
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <div
            className={`
              absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl border shadow-[0_10px_25px_rgba(76,29,149,0.14)] [backface-visibility:hidden]
              ${card.isMismatched
                ? 'border-red-400 bg-red-50 ring-2 ring-red-200'
                : 'border-white/60 bg-gradient-to-br from-primary-500 via-primary-500 to-secondary-500'}
            `}
          >
            <div className="absolute inset-x-3 top-2 h-6 rounded-full bg-white/20 blur-md" />
            <span className="text-2xl font-semibold text-white drop-shadow-sm">?</span>
          </div>

          <div
            className={`
              absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl border bg-white px-2 text-center shadow-[0_14px_30px_rgba(15,23,42,0.12)] [backface-visibility:hidden] [transform:rotateY(180deg)]
              ${card.isMatched
                ? 'border-emerald-300 bg-emerald-50'
                : card.isMismatched
                ? 'border-red-400 bg-red-50 ring-2 ring-red-200'
                : 'border-slate-200'}
            `}
          >
            <div className="text-sm font-bold leading-tight text-slate-800 sm:text-base md:text-lg">
              {card.content}
            </div>
          </div>
        </motion.button>
      </div>
    </motion.div>
  )
}
