'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Header } from '../../../components/Header'
import { GRAVITY_LEVELS_DATA } from '../../../src/data/gravityGameLevels'

export default function GravitySlingshotPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEE9FF] via-[#F5F0FF] to-[#FAF5FF]">
      <div className="max-w-4xl mx-auto px-4 pt-4">
        {/* Кнопка "Назад до математики" над заголовком в Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 text-left"
        >
          <Link
            href="/math"
            className="inline-flex items-center px-6 py-3 bg-gray-500 text-white rounded-2xl hover:bg-gray-600 transition-colors"
          >
            ← Назад до математики
          </Link>
        </motion.div>
        
        {/* Header с заголовком */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
            Орбітальна Арифметика
          </h1>
        </motion.div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <p className="text-lg text-gray-600 mb-8">
            Оберіть рівень та запустіть гру!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {GRAVITY_LEVELS_DATA.map((level, index) => (
            <Link
              key={level.level}
              href={`/math/gravity-slingshot/${level.level}`}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200 hover:border-purple-400 transition-colors"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">🚀</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Рівень {level.level}
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Астероїдів: {level.level === 1 ? 3 : level.level === 2 ? 4 : 5}</p>
                    <p>Правильних: {level.level === 1 ? 1 : 2}</p>
                    <p>Операції: {['+', '-', '*', '/'].slice(0, level.level + 1).join(', ')}</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
