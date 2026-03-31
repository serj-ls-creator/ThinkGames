'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { PageHeaderProps } from '../../types'
import { useAuth } from '../../context/AuthContext'
import { getUserStats, getLevelProgress } from '../../lib/points'
import { useEffect, useState } from 'react'

const colorClasses = {
  purple: 'from-purple-600 to-indigo-600',
  orange: 'from-orange-600 to-amber-600',
  blue: 'from-blue-600 to-indigo-600',
}

const hoverColors = {
  purple: 'hover:text-purple-600',
  orange: 'hover:text-orange-600',
  blue: 'hover:text-blue-600',
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  showBack = true, 
  backHref = '/',
  backLabel = 'Назад до головної',
  color = 'purple'
}) => {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [userStats, setUserStats] = useState({
    math: { currentLevel: 1, xpInLevel: 0, xpToNextLevel: 500, progressPercentage: 0 },
    ukrainian: { currentLevel: 1, xpInLevel: 0, xpToNextLevel: 500, progressPercentage: 0 },
    dutch: { currentLevel: 1, xpInLevel: 0, xpToNextLevel: 500, progressPercentage: 0 }
  })

  // Загрузка статистики
  useEffect(() => {
    if (!user?.id) return

    const loadStats = async () => {
      const { success, data } = await getUserStats(user.id)
      if (success && data) {
        setStats(data)
        setUserStats({
          math: getLevelProgress(data.math_xp || 0),
          ukrainian: getLevelProgress(data.ukrainian_xp || 0), // Используем ukrainian_xp
          dutch: getLevelProgress(data.dutch_xp || 0)
        })
      }
    }

    loadStats()
  }, [user?.id])

  // Обновление при фокусе
  useEffect(() => {
    if (!user?.id) return
    
    const updateProgress = async () => {
      const { success, data } = await getUserStats(user.id)
      if (success && data) {
        setStats(data)
        setUserStats({
          math: getLevelProgress(data.math_xp || 0),
          ukrainian: getLevelProgress(data.ukrainian_xp || 0), // Используем ukrainian_xp
          dutch: getLevelProgress(data.dutch_xp || 0)
        })
      }
    }
    
    window.addEventListener('focus', updateProgress)
    
    return () => {
      window.removeEventListener('focus', updateProgress)
    }
  }, [user?.id])
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-8"
    >
      {showBack && (
        <Link
          href={backHref}
          className={`inline-flex items-center text-gray-600 ${hoverColors[color]} transition-colors mb-6 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md`}
        >
          ← {backLabel}
        </Link>
      )}
      
      <h1 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent mb-4`}>
        {title}
      </h1>
      
      {/* Отображение статистики */}
      {user && stats && (
        <div className="flex justify-center gap-4 text-sm text-gray-600">
          <span>🔢 {userStats.math.currentLevel} ({stats?.math_xp || 0} XP)</span>
          <span>🇺🇦 {userStats.ukrainian.currentLevel} ({stats?.ukrainian_xp || 0} XP)</span>
          <span>🇳🇱 {userStats.dutch.currentLevel} ({stats?.dutch_xp || 0} XP)</span>
        </div>
      )}
    </motion.div>
  )
}
