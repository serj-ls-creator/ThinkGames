'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'

interface SubjectCard {
  id: string
  title: string
  icon: string
  description: string
  progress: number
  color: string
  href: string
}

const subjects: SubjectCard[] = [
  {
    id: 'math',
    title: 'Математика',
    icon: '🧮',
    description: 'Вивчай числа та розв\'язуй задачі',
    progress: 75,
    color: 'from-purple-500 to-purple-600',
    href: '/math'
  },
  {
    id: 'dutch',
    title: 'Нідерландська',
    icon: '/flags/netherlands.svg',
    description: 'Вивчай нові слова та фрази',
    progress: 30,
    color: 'from-orange-500 to-orange-600',
    href: '/dutch'
  },
  {
    id: 'ukrainian',
    title: 'Українська',
    icon: '/flags/ukraine.svg',
    description: 'Покращуй свою мову',
    progress: 50,
    color: 'from-blue-500 to-blue-600',
    href: '/ukrainian'
  }
]

export const HomePage: React.FC = () => {
  const [userName] = useState('Друже')
  const overallProgress = 52

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEE9FF] via-[#F5F0FF] to-[#FAF5FF]">
      <div className="max-w-sm mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {userName.charAt(0)}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">
                Привіт, {userName}!
              </h1>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${overallProgress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
                  />
                </div>
                <span className="text-xs text-gray-600">{overallProgress}%</span>
              </div>
            </div>
          </div>
          
          <button className="relative p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="w-6 h-6 flex items-center justify-center text-lg">
              🔔
            </div>
            <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
          </button>
        </motion.div>

        {/* Subject Cards */}
        <div className="space-y-4">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href={subject.href}>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {/* Color Accent */}
                  <div className={`h-2 bg-gradient-to-r ${subject.color}`}></div>
                  
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white/70 ring-1 ring-black/5">
                          {subject.icon.startsWith('/') ? (
                            <img src={subject.icon} alt="" className="h-8 w-8 rounded-full object-cover" />
                          ) : (
                            <span className="text-3xl leading-none">{subject.icon}</span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {subject.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {subject.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">Прогрес</span>
                        <span className="text-xs font-medium text-gray-700">
                          {subject.progress}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${subject.progress}%` }}
                          transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                          className={`h-full bg-gradient-to-r ${subject.color}`}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      className={`w-full py-3 px-4 bg-gradient-to-r ${subject.color} text-white font-bold rounded-xl hover:opacity-90 transition-opacity duration-200 flex items-center justify-center space-x-2`}
                    >
                      <span>Перейти →</span>
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Daily Challenge Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6"
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Щоденний виклик</h3>
                <p className="text-sm opacity-90 mt-1">
                  Виконай 5 завдань сьогодні!
                </p>
              </div>
              <div className="text-3xl">🏆</div>
            </div>
            <div className="mt-3 bg-white/20 rounded-lg px-3 py-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium">Прогрес сьогодні</span>
                <span className="text-xs font-bold">3/5</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-sm mx-auto px-4 py-2">
          <div className="flex justify-around items-center">
            <button className="flex flex-col items-center p-2 text-purple-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              <span className="text-xs mt-1 font-medium">Головна</span>
            </button>
            
            <button className="flex flex-col items-center p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
              <span className="text-xs mt-1">Ігри</span>
            </button>
            
            <button className="flex flex-col items-center p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
              <span className="text-xs mt-1">Прогрес</span>
            </button>
            
            <button className="flex flex-col items-center p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
              </svg>
              <span className="text-xs mt-1">Налаштування</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
