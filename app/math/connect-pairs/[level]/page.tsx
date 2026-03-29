'use client'

import { ConnectPairsGame } from '../../../../components/ConnectPairsGame'
import { mathLevels } from '../../../../data/math-pairs'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface MathConnectPairsPageProps {
  params: {
    level: string
  }
}

export default function MathConnectPairsPage({ params }: MathConnectPairsPageProps) {
  const levelNum = parseInt(params.level)
  
  if (isNaN(levelNum) || levelNum < 1 || levelNum > 10) {
    notFound()
  }

  const levelData = mathLevels.find(l => l.level === levelNum)
  
  if (!levelData) {
    notFound()
  }

  return (
    <div>
      {/* Back Navigation */}
      <div className="absolute top-4 left-4 z-10">
        <Link
          href="/math"
          className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md"
        >
          ← Назад до математики
        </Link>
      </div>

      <ConnectPairsGame 
        items={levelData.pairs} 
        title={`Математика - Таблиця на ${levelNum === 10 ? '11-12' : levelNum}`}
        category="math"
      />
    </div>
  )
}
