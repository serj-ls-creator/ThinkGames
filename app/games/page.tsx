'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const allGames = [
  {
    id: 'math-pair-game',
    title: 'Знайди пару',
    icon: '🎏',
    href: '/math/pair-game',
    colorClass: 'from-purple-100 to-purple-200 text-purple-800 hover:from-purple-200 hover:to-purple-300',
    iconClass: 'bg-purple-500',
  },
  {
    id: 'math-connect-pairs',
    title: "З'єднай пару",
    icon: '🔗',
    href: '/math/connect-pairs',
    colorClass: 'from-purple-100 to-purple-200 text-purple-800 hover:from-purple-200 hover:to-purple-300',
    iconClass: 'bg-purple-500',
  },
  {
    id: 'math-gravity-slingshot',
    title: 'Орбітальна арифметика',
    icon: '🚀',
    href: '/math/gravity-slingshot',
    colorClass: 'from-purple-100 to-purple-200 text-purple-800 hover:from-purple-200 hover:to-purple-300',
    iconClass: 'bg-purple-500',
  },
  {
    id: 'math-balloon-sweeper',
    title: 'Кульковий сапер',
    icon: '🎈',
    href: '/math/balloon-sweeper',
    colorClass: 'from-purple-100 to-purple-200 text-purple-800 hover:from-purple-200 hover:to-purple-300',
    iconClass: 'bg-purple-500',
  },
  {
    id: 'math-balance-scale',
    title: 'Ваги рівноваги',
    icon: '⚖️',
    href: '/math/balance-scale',
    colorClass: 'from-purple-100 to-purple-200 text-purple-800 hover:from-purple-200 hover:to-purple-300',
    iconClass: 'bg-purple-500',
  },
  {
    id: 'ukrainian-write-word',
    title: 'Напиши слово',
    icon: '✏️',
    href: '/ukrainian/write-word',
    colorClass: 'from-blue-100 to-blue-200 text-blue-800 hover:from-blue-200 hover:to-blue-300',
    iconClass: 'bg-blue-500',
  },
  {
    id: 'dutch-connect-pairs',
    title: "З'єднай слова",
    icon: '🔗',
    href: '/dutch/connect-pairs',
    colorClass: 'from-orange-100 to-orange-200 text-orange-800 hover:from-orange-200 hover:to-orange-300',
    iconClass: 'bg-orange-500',
  },
  {
    id: 'dutch-wordle',
    title: 'Вгадай слово',
    icon: '🎯',
    href: '/dutch/wordle',
    colorClass: 'from-amber-100 to-orange-200 text-orange-800 hover:from-amber-200 hover:to-orange-300',
    iconClass: 'bg-amber-500',
  },
]

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEE9FF] via-[#F5F0FF] to-[#FAF5FF] px-4 py-8 pb-24">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <Link
            href="/"
            className="mb-6 inline-flex items-center rounded-full bg-white/80 px-4 py-2 text-gray-600 shadow-md backdrop-blur-sm transition-colors hover:text-gray-800"
          >
            ← Назад до головної
          </Link>

          <h1 className="mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Усі ігри
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Тут зібрані всі доступні ігри з усіх розділів в одному місці.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 md:gap-6">
          {allGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={game.href}
                className={`group block rounded-2xl bg-gradient-to-br p-4 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-6 md:p-8 ${game.colorClass}`}
              >
                <div
                  className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl text-2xl transition-transform duration-300 group-hover:scale-110 sm:mb-4 sm:h-14 sm:w-14 sm:text-3xl ${game.iconClass}`}
                >
                  {game.icon}
                </div>

                <h3 className="mb-1 text-center text-base font-bold sm:mb-2 sm:text-lg md:text-xl">
                  {game.title}
                </h3>

                <div className="text-center text-xs opacity-75 sm:text-sm">Натисніть щоб почати гру</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
