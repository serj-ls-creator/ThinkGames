'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { UKRAINIAN_LEVELS } from '../../../../src/constants/ukrainianWords'

export default function WriteWordLevelsPage() {
  const handleLevelSelect = (level: number) => {
    // В будущем можно добавить сохранение выбранного уровня
    window.location.href = `/ukrainian/write-word/level/${level}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Навигация */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/ukrainian"
            className="inline-flex items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md text-gray-700 hover:text-blue-600 transition-colors"
          >
            ← Назад до ігор
          </Link>
        </motion.div>

        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Напиши слово
          </h1>
          <p className="text-lg text-gray-600">
            Оберіть рівень складності слів
          </p>
        </motion.div>

        {/* Сетка уровней */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {UKRAINIAN_LEVELS.map((level, index) => (
            <motion.button
              key={level.level}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleLevelSelect(level.level)}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-200"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-3">
                  <span className="text-white text-xl font-bold">
                    {level.level}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Рівень {level.level}
                </h3>
                <p className="text-sm text-gray-600 leading-tight">
                  {level.title}
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  {level.words.length} слів
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Дополнительная информация */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Як грати?
            </h2>
            <div className="text-gray-600 space-y-2">
              <p>🎧 <strong>Слухай слово</strong> — натисни кнопку 🔊 для прослуховування</p>
              <p>🔤 <strong>Збирай букви</strong> — натискай на букви у правильному порядку</p>
              <p>↩️ <strong>Виправляй помилки</strong> — використовуй кнопку «Стерти»</p>
              <p>⭐ <strong>Отримуй бали</strong> — за кожне правильне слово</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
