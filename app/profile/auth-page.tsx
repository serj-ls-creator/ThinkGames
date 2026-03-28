'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BottomNav } from '../../src/components/layout/BottomNav'
import { ProgressBar } from '../../src/components/ui/ProgressBar'
import {
  AVATAR_OPTIONS,
  DEFAULT_PROFILE,
  PROFILE_STORAGE_KEY,
  UserProfile,
  normalizeProfile,
} from '../../src/lib/profile'
import { getCategoryProgress, POINTS_PER_LEVEL, isUserAuthenticated } from '../../src/lib/auth-points'
import { useAuth } from '../../src/context/AuthContext'

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth()
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE)
  const [draftName, setDraftName] = useState(DEFAULT_PROFILE.name)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY)
      const nextProfile = normalizeProfile(savedProfile ? JSON.parse(savedProfile) : null)
      setProfile(nextProfile)
      setDraftName(nextProfile.name)
    } catch (error) {
      console.error('Failed to load user profile:', error)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!isHydrated) return

    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
    } catch (error) {
      console.error('Failed to save user profile:', error)
    }
  }, [isHydrated, profile])

  // Обновление прогресса при изменении
  useEffect(() => {
    if (!isHydrated) return
    
    const updateProgress = () => {
      // Принудительное обновление компонента для отображения новых данных
      const event = new Event('storage')
      window.dispatchEvent(event)
    }
    
    window.addEventListener('storage', updateProgress)
    window.addEventListener('focus', updateProgress)
    
    return () => {
      window.removeEventListener('storage', updateProgress)
      window.removeEventListener('focus', updateProgress)
    }
  }, [isHydrated])

  const greetingName = useMemo(() => profile.name || DEFAULT_PROFILE.name, [profile.name])
  
  // Информация по категориям с учетом авторизации
  const categoryInfo = useMemo(() => {
    return {
      math: getCategoryProgress('math', user),
      dutch: getCategoryProgress('dutch', user),
      ukrainian: getCategoryProgress('ukrainian', user)
    }
  }, [user, isHydrated])

  // Глобальный уровень (сумма всех XP)
  const globalLevel = useMemo(() => {
    const userId = user?.id || localStorage.getItem('anonymous_session_id') || 'default';
    const totalXP = Number(localStorage.getItem(`total_xp_${userId}`) || 0)
    const level = Math.floor(totalXP / POINTS_PER_LEVEL) + 1
    const progress = (totalXP % POINTS_PER_LEVEL) / POINTS_PER_LEVEL * 100
    
    return { level, progress }
  }, [user, isHydrated])

  const commitName = () => {
    setProfile((current) => ({
      ...current,
      name: draftName.trim() || DEFAULT_PROFILE.name,
    }))
    setDraftName((current) => current.trim() || DEFAULT_PROFILE.name)
  }

  const handleSignOut = async () => {
    await signOut()
  }

  // Если загружается, показываем спиннер
  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_40%),linear-gradient(135deg,#f7f2ff_0%,#eef6ff_52%,#fffaf0_100%)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Завантаження...</p>
        </div>
      </div>
    )
  }

  // Если пользователь не авторизован
  if (!user) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_40%),linear-gradient(135deg,#f7f2ff_0%,#eef6ff_52%,#fffaf0_100%)] pb-24">
        <div className="mx-auto max-w-sm px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-center"
          >
            <Link
              href="/"
              className="mb-8 inline-flex items-center rounded-full bg-white/85 px-4 py-2 text-sm text-gray-600 shadow-md backdrop-blur transition hover:text-purple-600"
            >
              ← Назад на головну
            </Link>

            <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_24px_60px_rgba(97,76,175,0.16)] backdrop-blur">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-purple-500 via-indigo-500 to-sky-500 text-4xl shadow-lg mx-auto">
                👤
              </div>
              
              <h1 className="mb-4 text-2xl font-bold text-gray-900">
                Вітаємо!
              </h1>
              
              <p className="mb-6 text-gray-600">
                Увійдіть або зареєструйтеся, щоб зберігати свій прогрес навіки та синхронізувати його між пристроями.
              </p>

              <div className="space-y-3">
                <Link
                  href="/login"
                  className="block w-full rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3 text-center text-base font-semibold text-white shadow-lg transition-all hover:opacity-95"
                >
                  Увійти / Зареєструватися
                </Link>
                
                <div className="rounded-2xl bg-yellow-50 p-4 text-center">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Увійдіть, щоб зберегти прогрес назавжди
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    Продовжуйте грати анонімно, але ваш прогрес буде збережено тільки на цьому пристрої
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_40%),linear-gradient(135deg,#f7f2ff_0%,#eef6ff_52%,#fffaf0_100%)] pb-24">
      <div className="mx-auto max-w-sm px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-6"
        >
          <Link
            href="/"
            className="mb-5 inline-flex items-center rounded-full bg-white/85 px-4 py-2 text-sm text-gray-600 shadow-md backdrop-blur transition hover:text-purple-600"
          >
            ← Назад на головну
          </Link>

          <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_60px_rgba(97,76,175,0.16)] backdrop-blur">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-purple-500 via-indigo-500 to-sky-500 text-4xl shadow-lg">
                {profile.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-purple-500">Профіль</p>
                <h1 className="mt-1 text-2xl font-bold text-gray-900">{greetingName}</h1>
                <p className="mt-1 text-sm text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100 transition-colors"
              >
                Вийти
              </button>
            </div>

            {/* Глобальный уровень */}
            <div className="rounded-3xl bg-gradient-to-r from-purple-50 via-white to-sky-50 p-4 mb-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-800">Глобальний рівень</span>
                <span className="text-sm font-bold text-purple-700">Рівень {globalLevel.level}</span>
              </div>
              <ProgressBar
                current={globalLevel.progress}
                total={100}
                color="bg-gradient-to-r from-purple-500 via-indigo-500 to-sky-500"
              />
              <p className="mt-2 text-xs text-gray-500">
                {Math.round(globalLevel.progress)}% до наступного рівня
              </p>
            </div>

            {/* Детализация по категориям */}
            <div className="space-y-3">
              <div className="rounded-2xl bg-gray-50/80 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔢</span>
                    <span className="text-sm font-semibold text-gray-800">Математика</span>
                  </div>
                  <span className="text-xs font-bold text-blue-700">Рівень {categoryInfo.math.level}</span>
                </div>
                <ProgressBar
                  current={categoryInfo.math.current}
                  total={categoryInfo.math.total}
                  color="bg-gradient-to-r from-blue-500 to-cyan-500"
                  height="h-1"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {categoryInfo.math.current} / {categoryInfo.math.total} XP до наступного рівня
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50/80 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇳🇱</span>
                    <span className="text-sm font-semibold text-gray-800">Нідерландська</span>
                  </div>
                  <span className="text-xs font-bold text-orange-700">Рівень {categoryInfo.dutch.level}</span>
                </div>
                <ProgressBar
                  current={categoryInfo.dutch.current}
                  total={categoryInfo.dutch.total}
                  color="bg-gradient-to-r from-orange-500 to-red-500"
                  height="h-1"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {categoryInfo.dutch.current} / {categoryInfo.dutch.total} XP до наступного рівня
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50/80 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇺🇦</span>
                    <span className="text-sm font-semibold text-gray-800">Українська</span>
                  </div>
                  <span className="text-xs font-bold text-green-700">Рівень {categoryInfo.ukrainian.level}</span>
                </div>
                <ProgressBar
                  current={categoryInfo.ukrainian.current}
                  total={categoryInfo.ukrainian.total}
                  color="bg-gradient-to-r from-green-500 to-emerald-500"
                  height="h-1"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {categoryInfo.ukrainian.current} / {categoryInfo.ukrainian.total} XP до наступного рівня
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="space-y-5"
        >
          <section className="rounded-[2rem] border border-white/70 bg-white/88 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="mb-3">
              <h2 className="text-lg font-bold text-gray-900">Ім&apos;я</h2>
              <p className="text-sm text-gray-500">Можеш стерти поле повністю і ввести нове ім&apos;я без автопідстановки.</p>
            </div>
            <div className="flex gap-2">
              <input
                value={draftName}
                onChange={(event) => setDraftName(event.target.value.slice(0, 24))}
                onBlur={commitName}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                placeholder="Введи ім&apos;я"
              />
              <button
                type="button"
                onClick={commitName}
                className="rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-95"
              >
                Зберегти
              </button>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/70 bg-white/88 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Аватар</h2>
                <p className="text-sm text-gray-500">Великий список смайликів для вибору</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
                {profile.avatar}
              </div>
            </div>

            <div className="grid max-h-[22rem] grid-cols-5 gap-3 overflow-y-auto rounded-3xl bg-gray-50/80 p-3 sm:grid-cols-6">
              {AVATAR_OPTIONS.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setProfile((current) => ({ ...current, avatar }))}
                  className={`flex h-12 w-full items-center justify-center rounded-2xl text-2xl transition ${
                    profile.avatar === avatar
                      ? 'bg-purple-100 ring-2 ring-purple-400 shadow-sm'
                      : 'bg-white hover:bg-purple-50'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </section>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  )
}
