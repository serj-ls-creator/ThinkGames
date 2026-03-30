'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { SectionCard } from '../src/components/layout/SectionCard'
import { BottomNav } from '../src/components/layout/BottomNav'
import { ProgressBar } from '../src/components/ui/ProgressBar'
import { SECTIONS } from '../src/constants'
import { DEFAULT_PROFILE } from '../src/lib/profile'
import { getLevelProgress, getUserStats } from '../src/lib/points'
import { getUserProfile } from '../src/lib/profile-db'
import { useAuth } from '../src/context/AuthContext'

export default function Home() {
  const { user } = useAuth()
  const [profile, setProfile] = useState({
    name: DEFAULT_PROFILE.name,
    avatar: DEFAULT_PROFILE.avatar
  })
  const [userStats, setUserStats] = useState({
    math: { currentLevel: 1, xpInLevel: 0, xpToNextLevel: 500, progressPercentage: 0 },
    ukrainian: { currentLevel: 1, xpInLevel: 0, xpToNextLevel: 500, progressPercentage: 0 },
    dutch: { currentLevel: 1, xpInLevel: 0, xpToNextLevel: 500, progressPercentage: 0 }
  })
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Загрузка профиля и статистики из Supabase
  useEffect(() => {
    if (!user?.id) {
      setLoading(true)
      return
    }

    const loadData = async () => {
      // Загрузка профиля
      const { success: profileSuccess, data: profileData } = await getUserProfile(user.id)
      if (profileSuccess && profileData) {
        setProfile({
          name: profileData.display_name || DEFAULT_PROFILE.name,
          avatar: profileData.avatar_url || DEFAULT_PROFILE.avatar
        })
      } else {
        // Если профиля нет, используем email и стандартный аватар
        setProfile({
          name: user.email || DEFAULT_PROFILE.name,
          avatar: DEFAULT_PROFILE.avatar
        })
      }

      // Загрузка статистики
      console.log('Главная: загружаем статистику для юзера:', user.id)
      const { success: statsSuccess, data: statsData } = await getUserStats(user.id)
      console.log('Главная: полученные данные статистики:', statsData)
      if (statsSuccess && statsData) {
        setStats(statsData) // Сохраняем сырые данные
        setUserStats({
          math: getLevelProgress(statsData.math_xp || 0),
          ukrainian: getLevelProgress(statsData.ukrainian_xp || 0), // Используем ukrainian_xp
          dutch: getLevelProgress(statsData.dutch_xp || 0)
        })
      }
      setLoading(false)
    }

    loadData()
  }, [user?.id, user?.email])

  // Обновление прогресса при изменении
  useEffect(() => {
    if (!user?.id) return
    
    const updateProgress = async () => {
      console.log('Главная: обновляем прогресс для юзера:', user.id)
      const { success, data } = await getUserStats(user.id)
      console.log('Главная: обновленные данные:', data)
      if (success && data) {
        setStats(data) // Обновляем сырые данные
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
    <div className="min-h-screen bg-gradient-to-br from-[#EEE9FF] via-[#F5F0FF] to-[#FAF5FF]">
      <div className="max-w-sm mx-auto px-4 py-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center"
        >
          <div className="mb-4 flex items-center justify-between">
            <Link
              href="/profile"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-xl text-white shadow-lg transition-transform hover:scale-105"
            >
                {profile.avatar}
            </Link>

            <div className="relative">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                <span className="text-xs">🔔</span>
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></div>
            </div>
          </div>

          <h1 className="mb-2 text-2xl font-bold text-gray-800">
            Привіт{profile.name && profile.name !== DEFAULT_PROFILE.name ? `, ${profile.name}` : ''}!
          </h1>

          <div className="space-y-2">
            <ProgressBar 
              current={userStats.math.xpInLevel} 
              total={userStats.math.xpToNextLevel} 
              showLabel={true} 
              color="bg-gradient-to-r from-blue-500 to-cyan-500"
            />
            <p className="text-sm text-gray-600">
              Математика: Lvl {userStats.math.currentLevel} - {loading ? '...' : `${userStats.math.xpInLevel}/${userStats.math.xpToNextLevel}`} XP
              {stats && ` (Всього: ${stats.total_xp} XP)`}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          {SECTIONS.map((subject) => {
            const subjectStats = userStats[subject.id as keyof typeof userStats];
            return (
              <SectionCard
                key={subject.id}
                title={subject.title}
                icon={subject.icon}
                description={subject.description}
                progress={subjectStats.progressPercentage}
                color={subject.color}
                href={subject.route}
                level={subjectStats.currentLevel}
                xp={`${subjectStats.xpInLevel}/${subjectStats.xpToNextLevel}`}
              />
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6"
        >
          <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg">
            <div className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">🌟</div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Щоденний виклик</h3>
                    <p className="mt-1 text-sm text-yellow-100">Виконай завдання дня</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs text-yellow-100">Прогрес</span>
                  <span className="text-xs font-medium text-white">3/5</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-yellow-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '60%' }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="h-full bg-white"
                  />
                </div>
              </div>

              <button className="w-full rounded-xl bg-white/20 px-4 py-3 font-bold text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/30">
                Продовжити →
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  )
}
