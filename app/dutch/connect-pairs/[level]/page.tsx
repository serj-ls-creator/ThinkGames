'use client'

import { DutchConnectPairsGame } from '../../../../components/DutchConnectPairsGame'
import { dutchLevels } from '../../../../data/dutch-words'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface DutchConnectPairsPageProps {
  params: {
    level: string
  }
}

export default function DutchConnectPairsPage({ params }: DutchConnectPairsPageProps) {
  const levelNum = parseInt(params.level)
  
  if (isNaN(levelNum) || levelNum < 1 || levelNum > 10) {
    notFound()
  }

  const levelData = dutchLevels.find(l => l.level === levelNum)
  
  if (!levelData) {
    notFound()
  }

  return (
    <div>
      {/* Back Navigation */}
      <div className="absolute top-4 left-4 z-10">
        <Link
          href="/dutch"
          className="inline-flex items-center text-gray-600 hover:text-orange-600 transition-colors bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md"
        >
          ← Назад до нідерландської
        </Link>
      </div>

      <DutchConnectPairsGame 
        items={levelData.pairs} 
        title={`Нідерландська - Рівень ${levelNum}`}
        category="dutch"
      />
    </div>
  )
}
