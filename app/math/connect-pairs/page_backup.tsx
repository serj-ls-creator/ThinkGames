'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CompactLevelSelector } from '../../../src/components/ui/CompactLevelSelector'
import { MATH_CONNECT_LEVELS } from '../../../src/constants'

export default function MathConnectPairsPage() {
  const router = useRouter()

  const handleLevelSelect = (level: number) => {
    router.push(`/math/connect-pairs/${level}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEE9FF] via-[#F5F0FF] to-[#FAF5FF] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Link
            href="/math"
            className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors mb-6 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md"
          >
            ← Назад до математики
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            З'єднай пару
          </h1>
          
          <p className="text-lg text-gray-600">
            Оберіть рівень таблиці множення
          </p>
        </motion.div>

        {/* Level Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CompactLevelSelector
            levels={MATH_CONNECT_LEVELS}
            colorTheme="purple"
            onLevelSelect={handleLevelSelect}
          />
        </motion.div>

        {/* Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-600 mb-4">Швидкий доступ:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[1, 2, 3].map((level) => (
              <Link
                key={level}
                href={`/math/connect-pairs/${level}`}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium"
              >
                Рівень {level}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
