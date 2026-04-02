'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BottomNav } from '../../src/components/layout/BottomNav'
import { ProgressBar } from '../../src/components/ui/ProgressBar'
import { useAuth } from '../../src/context/AuthContext'
import { LeaderboardEntryView, getLeaderboard } from '../../src/lib/leaderboard'

const getRankBadge = (rank: number) => {
  if (rank === 0) return '🥇'
  if (rank === 1) return '🥈'
  if (rank === 2) return '🥉'
  return `#${rank + 1}`
}

export default function LeaderboardPage() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<LeaderboardEntryView[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadLeaderboard = async () => {
      const { success, data, error } = await getLeaderboard()

      if (!success) {
        setError('Не вдалося завантажити leaderboard')
        console.error(error)
        setLoading(false)
        return
      }

      setEntries(data || [])
      setLoading(false)
    }

    loadLeaderboard()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEF7FF] via-[#F7FBFF] to-[#FFF7EB]">
      <div className="mx-auto max-w-sm px-4 py-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-6"
        >
          <div className="rounded-[28px] bg-white/90 p-5 shadow-lg ring-1 ring-black/5 backdrop-blur-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-2xl text-white shadow-md">
                🏆
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
                <p className="text-sm text-gray-600">
                  Рейтинг за зірками щоденного виклику та загальним XP
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-amber-50 px-3 py-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                  Гравців
                </div>
                <div className="mt-1 text-xl font-bold text-gray-900">{entries.length}</div>
              </div>
              <div className="rounded-2xl bg-purple-50 px-3 py-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-purple-700">
                  Лідер
                </div>
                <div className="mt-1 truncate text-sm font-bold text-gray-900">
                  {entries[0]?.display_name || '...'}
                </div>
              </div>
              <div className="rounded-2xl bg-blue-50 px-3 py-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                  Зірок
                </div>
                <div className="mt-1 text-xl font-bold text-gray-900">{entries[0]?.stars || 0}</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-3">
          {loading && (
            <div className="rounded-3xl bg-white p-5 text-center text-sm text-gray-500 shadow-sm">
              Завантаження leaderboard...
            </div>
          )}

          {!loading && error && (
            <div className="rounded-3xl bg-white p-5 text-center text-sm text-red-500 shadow-sm">
              {error}
            </div>
          )}

          {!loading && !error && entries.length === 0 && (
            <div className="rounded-3xl bg-white p-5 text-center text-sm text-gray-500 shadow-sm">
              Ще немає даних для рейтингу
            </div>
          )}

          {!loading &&
            !error &&
            entries.map((entry, index) => {
              const isCurrentUser = entry.user_id === user?.id

              return (
                <motion.div
                  key={entry.user_id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className={`rounded-[28px] p-[1px] shadow-lg ${
                    isCurrentUser
                      ? 'bg-gradient-to-r from-purple-500 via-pink-400 to-amber-400'
                      : 'bg-white/70'
                  }`}
                >
                  <div className="rounded-[27px] bg-white p-4">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-11 min-w-11 items-center justify-center rounded-2xl bg-gray-100 text-sm font-bold text-gray-700">
                        {getRankBadge(index)}
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 text-2xl text-white shadow-sm">
                        {entry.avatar_url}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="truncate text-base font-bold text-gray-900">
                          {entry.display_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Рівень {entry.level} · {entry.total_xp} XP
                        </div>
                      </div>

                      <div className="rounded-2xl bg-amber-50 px-3 py-2 text-right">
                        <div className="text-xs font-semibold text-amber-700">⭐ Зірки</div>
                        <div className="text-lg font-bold text-gray-900">{entry.stars}</div>
                      </div>
                    </div>

                    <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                      <span>Загальний прогрес</span>
                      <span>{entry.xpInLevel}/{500} XP</span>
                    </div>
                    <ProgressBar
                      current={entry.xpInLevel}
                      total={500}
                      color="bg-gradient-to-r from-blue-500 to-cyan-500"
                    />

                    {isCurrentUser && (
                      <div className="mt-3 rounded-2xl bg-purple-50 px-3 py-2 text-center text-xs font-semibold text-purple-700">
                        Це ти
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
