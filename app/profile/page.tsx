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
import { getStoredPoints, POINTS_GOAL } from '../../src/lib/points'

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE)
  const [draftName, setDraftName] = useState(DEFAULT_PROFILE.name)
  const [points, setPoints] = useState(0)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY)
      const nextProfile = normalizeProfile(savedProfile ? JSON.parse(savedProfile) : null)
      setProfile(nextProfile)
      setDraftName(nextProfile.name)
      setPoints(getStoredPoints())
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

  const greetingName = useMemo(() => profile.name || DEFAULT_PROFILE.name, [profile.name])

  const commitName = () => {
    setProfile((current) => ({
      ...current,
      name: draftName.trim() || DEFAULT_PROFILE.name,
    }))
    setDraftName((current) => current.trim() || DEFAULT_PROFILE.name)
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
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-purple-500">Профіль</p>
                <h1 className="mt-1 text-2xl font-bold text-gray-900">{greetingName}</h1>
                <p className="mt-1 text-sm text-gray-500">Налаштуй аватар, ім&apos;я та свій прогрес</p>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-r from-purple-50 via-white to-sky-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-800">Очки</span>
                <span className="text-sm font-bold text-purple-700">{points}</span>
              </div>
              <ProgressBar
                current={points}
                total={POINTS_GOAL}
                color="bg-gradient-to-r from-purple-500 via-indigo-500 to-sky-500"
              />
              <p className="mt-2 text-xs text-gray-500">
                Очки нараховуються за кожну правильну відповідь у всіх іграх.
              </p>
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
