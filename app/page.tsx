'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SectionCard } from '../src/components/layout/SectionCard'
import { BottomNav } from '../src/components/layout/BottomNav'
import { ProgressBar } from '../src/components/ui/ProgressBar'
import { SECTIONS } from '../src/constants'

export default function Home() {
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
          className="text-center mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {userName.charAt(0)}
            </div>
            <div className="relative">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs">🔔</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Привіт, {userName}!
          </h1>
          
          <div className="space-y-2">
            <ProgressBar current={overallProgress} total={100} showLabel={true} />
            <p className="text-sm text-gray-600">Твій загальний прогрес</p>
          </div>
        </motion.div>

        {/* Subject Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          {SECTIONS.map((subject, index) => (
            <SectionCard
              key={subject.id}
              title={subject.title}
              icon={subject.icon}
              description={subject.description}
              progress={subject.progress}
              color={subject.color}
              href={subject.route}
            />
          ))}
        </motion.div>

        {/* Daily Challenge Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6"
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">🌟</div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Щоденний виклик</h3>
                    <p className="text-sm text-yellow-100 mt-1">Виконай завдання дня</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-yellow-100">Прогрес</span>
                  <span className="text-xs font-medium text-white">3/5</span>
                </div>
                <div className="w-full h-2 bg-yellow-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '60%' }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="h-full bg-white"
                  />
                </div>
              </div>

              <button className="w-full py-3 px-4 bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white/30 transition-colors duration-200">
                Продовжити →
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
