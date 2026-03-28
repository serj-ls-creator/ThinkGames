'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '../../src/context/AuthContext'

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn, signUp, user } = useAuth()
  const router = useRouter()

  // Если пользователь уже авторизован, перенаправляем на профиль
  if (user) {
    router.push('/profile')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = activeTab === 'login' 
      ? await signIn(email, password)
      : await signUp(email, password)

    if (error) {
      setError(error.message)
    } else if (activeTab === 'login') {
      // Успешный вход
      router.push('/profile')
    } else {
      // Успешная регистрация
      setError('Перевірте пошту для підтвердження реєстрації')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_40%),linear-gradient(135deg,#f7f2ff_0%,#eef6ff_52%,#fffaf0_100%)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md"
      >
        {/* Навигация назад */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center rounded-full bg-white/85 px-4 py-2 text-sm text-gray-600 shadow-md backdrop-blur transition hover:text-purple-600"
        >
          ← Назад на головну
        </Link>

        {/* Форма авторизации */}
        <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_24px_60px_rgba(97,76,175,0.16)] backdrop-blur">
          <h1 className="mb-6 text-center text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {activeTab === 'login' ? 'Вхід' : 'Реєстрація'}
          </h1>

          {/* Вкладки */}
          <div className="mb-6 flex rounded-2xl bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Увійти
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                activeTab === 'register'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Реєстрація
            </button>
          </div>

          {/* Форма */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                placeholder="введіть@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                placeholder="Мінімум 6 символів"
              />
            </div>

            {error && (
              <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:opacity-95 disabled:opacity-50"
            >
              {loading ? 'Завантаження...' : activeTab === 'login' ? 'Увійти' : 'Зареєструватися'}
            </button>
          </form>

          {/* Дополнительная информация */}
          <div className="mt-6 text-center text-xs text-gray-500">
            {activeTab === 'login' ? (
              <p>
                Немає акаунта?{' '}
                <button
                  onClick={() => setActiveTab('register')}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Зареєструйтеся
                </button>
              </p>
            ) : (
              <p>
                Вже є акаунт?{' '}
                <button
                  onClick={() => setActiveTab('login')}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Увійдіть
                </button>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
