'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface GameCard {
  id: string
  title: string
  icon: string
  href: string
  color: string
}

interface SubjectPageProps {
  title: string
  description: string
  games: GameCard[]
  colorTheme: 'purple' | 'orange'
}

const colorThemes = {
  purple: {
    bg: 'from-purple-100 to-purple-200',
    text: 'text-purple-800',
    hover: 'hover:from-purple-200 hover:to-purple-300',
    iconBg: 'bg-purple-500'
  },
  orange: {
    bg: 'from-orange-100 to-orange-200',
    text: 'text-orange-800',
    hover: 'hover:from-orange-200 hover:to-orange-300',
    iconBg: 'bg-orange-500'
  }
}

export const SubjectPage: React.FC<SubjectPageProps> = ({ 
  title, 
  description, 
  games, 
  colorTheme = 'purple' 
}) => {
  const theme = colorThemes[colorTheme]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEE9FF] via-[#F5F0FF] to-[#FAF5FF] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-6 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md"
          >
            ← Назад до головної
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            {title}
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {description}
          </p>
        </motion.div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={game.href}
                className={`block p-8 bg-gradient-to-br ${theme.bg} ${theme.hover} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group`}
              >
                <div className={`w-16 h-16 ${theme.iconBg} rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  {game.icon}
                </div>
                
                <h3 className={`text-xl font-bold ${theme.text} mb-2 text-center`}>
                  {game.title}
                </h3>
                
                <div className={`text-sm ${theme.text} opacity-75 text-center`}>
                  Натисніть щоб почати гру
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Empty State for no games */}
        {games.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Скоро буде доступно!
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Ми працюємо над створенням захоплюючих ігор для цього розділу.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Повернутися на головну
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}
