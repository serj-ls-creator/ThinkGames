'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LevelSelectorCompact } from '../../../components/LevelSelectorCompact'

const dutchLevels = [
  { value: 1, label: 'Рівень 1', description: 'Базові слова' },
  { value: 2, label: 'Рівень 2', description: 'Школа та навчання' },
  { value: 3, label: 'Рівень 3', description: 'Сім\'я та люди' },
  { value: 4, label: 'Рівень 4', description: 'Тварини' },
  { value: 5, label: 'Рівень 5', description: 'Кольори' },
  { value: 6, label: 'Рівень 6', description: 'Числа' },
  { value: 7, label: 'Рівень7', description: 'Їжа та напої' },
  { value: 8, label: 'Рівень 8', description: 'Одяг' },
  { value: 9, label: 'Рівень 9', description: 'Погода' },
  { value: 10, label: 'Рівень 10', description: 'Час та дата' },
]

export default function DutchConnectPairsPage() {
  const router = useRouter()

  const handleLevelSelect = (level: number) => {
    router.push(`/dutch/connect-pairs/${level}`)
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
            href="/dutch"
            className="inline-flex items-center text-gray-600 hover:text-orange-600 transition-colors mb-6 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md"
          >
            ← Назад до нідерландської
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
            З'єднай слова
          </h1>
          
          <p className="text-lg text-gray-600">
            Оберіть рівень складності слів
          </p>
        </motion.div>

        {/* Level Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <LevelSelectorCompact
            levels={dutchLevels}
            colorTheme="orange"
            onLevelSelect={handleLevelSelect}
          />
        </motion.div>

        {/* Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 mb-4">Швидкий доступ:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[1, 2, 3].map((level) => (
              <Link
                key={level}
                href={`/dutch/connect-pairs/${level}`}
                className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors font-medium"
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
