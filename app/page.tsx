'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BottomNav } from '../src/components/layout/BottomNav'
import { SectionCard } from '../src/components/layout/SectionCard'
import { ProgressBar } from '../src/components/ui/ProgressBar'
import { SECTIONS } from '../src/constants'
import { useAuth } from '../src/context/AuthContext'
import { DAILY_CHALLENGE_GOAL_DAYS, getDailyChallengeState } from '../src/lib/dailyChallenge'
import {
  DailyMessage,
  getTodayDailyMessage,
  isDailyMessageRead,
  markDailyMessageAsRead,
} from '../src/lib/dailyMessages'
import { DEFAULT_PROFILE } from '../src/lib/profile'
import { getUserProfile } from '../src/lib/profile-db'
import { getLevelProgress, getUserStats } from '../src/lib/points'

type SubjectProgress = {
  currentLevel: number
  xpInLevel: number
  xpToNextLevel: number
  progressPercentage: number
}

type DailyChallengeViewState = {
  stars: number
  daysInCycle: number
}

const DEFAULT_SUBJECT_PROGRESS: SubjectProgress = {
  currentLevel: 1,
  xpInLevel: 0,
  xpToNextLevel: 500,
  progressPercentage: 0,
}

export default function Home() {
  const { user } = useAuth()
  const [profile, setProfile] = useState({
    name: DEFAULT_PROFILE.name,
    avatar: DEFAULT_PROFILE.avatar,
  })
  const [userStats, setUserStats] = useState({
    math: DEFAULT_SUBJECT_PROGRESS,
    ukrainian: DEFAULT_SUBJECT_PROGRESS,
    dutch: DEFAULT_SUBJECT_PROGRESS,
  })
  const [stats, setStats] = useState<any>(null)
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallengeViewState>({
    stars: 0,
    daysInCycle: 0,
  })
  const [dailyMessage, setDailyMessage] = useState<DailyMessage | null>(null)
  const [isMessageRead, setIsMessageRead] = useState(true)
  const [isMessageOpen, setIsMessageOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const todayMessage = getTodayDailyMessage()
    setDailyMessage(todayMessage)
    setIsMessageRead(isDailyMessageRead(todayMessage, user?.id))
  }, [user?.id])

  useEffect(() => {
    if (!user?.id) {
      setDailyChallenge({
        stars: 0,
        daysInCycle: 0,
      })
      setLoading(false)
      return
    }

    const loadData = async () => {
      const { success: challengeSuccess, data: challengeData } = await getDailyChallengeState(user.id)
      if (challengeSuccess && challengeData) {
        setDailyChallenge(challengeData)
      }

      const { success: profileSuccess, data: profileData } = await getUserProfile(user.id)
      if (profileSuccess && profileData) {
        setProfile({
          name: profileData.display_name || DEFAULT_PROFILE.name,
          avatar: profileData.avatar_url || DEFAULT_PROFILE.avatar,
        })
      } else {
        setProfile({
          name: user.email || DEFAULT_PROFILE.name,
          avatar: DEFAULT_PROFILE.avatar,
        })
      }

      const { success: statsSuccess, data: statsData } = await getUserStats(user.id)
      if (statsSuccess && statsData) {
        setStats(statsData)
        setUserStats({
          math: getLevelProgress(statsData.math_xp || 0),
          ukrainian: getLevelProgress(statsData.ukrainian_xp || 0),
          dutch: getLevelProgress(statsData.dutch_xp || 0),
        })
      }

      setLoading(false)
    }

    void loadData()
  }, [user?.email, user?.id])

  useEffect(() => {
    const updateProgress = async () => {
      const todayMessage = getTodayDailyMessage()
      setDailyMessage(todayMessage)
      setIsMessageRead(isDailyMessageRead(todayMessage, user?.id))

      if (!user?.id) return

      const { success: challengeSuccess, data: challengeData } = await getDailyChallengeState(user.id)
      if (challengeSuccess && challengeData) {
        setDailyChallenge(challengeData)
      }

      const { success, data } = await getUserStats(user.id)
      if (success && data) {
        setStats(data)
        setUserStats({
          math: getLevelProgress(data.math_xp || 0),
          ukrainian: getLevelProgress(data.ukrainian_xp || 0),
          dutch: getLevelProgress(data.dutch_xp || 0),
        })
      }
    }

    window.addEventListener('focus', updateProgress)

    return () => {
      window.removeEventListener('focus', updateProgress)
    }
  }, [user?.id])

  const handleOpenMessage = () => {
    if (!dailyMessage) return

    markDailyMessageAsRead(dailyMessage, user?.id)
    setIsMessageRead(true)
    setIsMessageOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEE9FF] via-[#F5F0FF] to-[#FAF5FF]">
      <div className="mx-auto max-w-sm px-4 py-6 pb-24">
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

            <div className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 shadow-sm ring-1 ring-yellow-200">
              <span className="text-base leading-none">⭐</span>
              <span className="text-sm font-bold text-gray-800">{dailyChallenge.stars}</span>
            </div>

            <button
              type="button"
              onClick={handleOpenMessage}
              className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-lg shadow-sm transition-transform hover:scale-105"
              aria-label="Відкрити повідомлення дня"
            >
              <span>🔔</span>
              {!isMessageRead && (
                <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-red-500" />
              )}
            </button>
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
            {stats && (
              <p className="text-sm text-gray-600">
                Lvl {Math.floor(stats.total_xp / 500) + 1} - Всього: {stats.total_xp} XP
              </p>
            )}
            {!stats && !loading && <p className="text-sm text-gray-600">Всього: 0 XP</p>}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          {SECTIONS.map((subject) => {
            const subjectStats = userStats[subject.id as keyof typeof userStats]

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
                  <div className="text-3xl">⭐</div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Щоденний виклик</h3>
                    <p className="mt-1 text-sm text-yellow-100">
                      Проходь хоча б 1 гру на день 5 днів поспіль
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs text-yellow-100">Прогрес</span>
                  <span className="text-xs font-medium text-white">
                    {dailyChallenge.daysInCycle}/{DAILY_CHALLENGE_GOAL_DAYS}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-yellow-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(dailyChallenge.daysInCycle / DAILY_CHALLENGE_GOAL_DAYS) * 100}%`,
                    }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="h-full bg-white"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-white/20 px-4 py-3 text-center text-sm font-semibold text-white backdrop-blur-sm">
                Отримано зірок: {dailyChallenge.stars}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {isMessageOpen && dailyMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-sm rounded-[1.75rem] bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
                  Повідомлення дня
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">Маленька головоломка</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsMessageOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-700 transition-colors hover:bg-slate-200"
                aria-label="Закрити повідомлення"
              >
                ×
              </button>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-amber-50 via-white to-orange-50 p-4 text-left shadow-inner">
              <div className="mb-3 text-3xl">🧩</div>
              <p className="text-base font-medium leading-7 text-slate-800">{dailyMessage.text}</p>
            </div>

            <button
              type="button"
              onClick={() => setIsMessageOpen(false)}
              className="mt-5 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.01]"
            >
              Зрозуміло
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
