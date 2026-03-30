'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

const levels = [
  { level: 4, title: 'Новачок', description: 'Легкі слова (4 букви)', color: 'from-green-400 to-green-600' },
  { level: 5, title: 'Середній', description: 'Середні слова (5 букв)', color: 'from-blue-400 to-blue-600' },
  { level: 6, title: 'Просунутий', description: 'Складні слова (6 букв)', color: 'from-purple-400 to-purple-600' },
  { level: 7, title: 'Експерт', description: 'Дуже складні слова (7 букв)', color: 'from-red-400 to-red-600' }
]

export default function DutchWordleLevels() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-3 py-3 sm:px-4 sm:py-4">
      <div className="mx-auto max-w-4xl">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <Link 
            href="/dutch"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            ← Назад до голландської
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Вгадай слово</h1>
          <p className="text-gray-600">Оберіть рівень складності</p>
        </div>

        {/* Карточки уровней */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {levels.map((levelInfo) => (
            <div
              key={levelInfo.level}
              onClick={() => router.push(`/dutch/wordle/level/${levelInfo.level}`)}
              className={`bg-gradient-to-r ${levelInfo.color} p-6 rounded-2xl text-white cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl`}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-bold">{levelInfo.title}</h2>
                <span className="text-3xl">🎯</span>
              </div>
              <p className="text-white/90 mb-4">{levelInfo.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-75">20 слів</span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {levelInfo.level} букв
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Правила игры */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📖 Правила гри</h3>
          <div className="space-y-3 text-gray-600">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="font-medium">Мета гри</p>
                <p className="text-sm">Вгадати голландське слово за 6 спроб</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🟩</span>
              <div>
                <p className="font-medium">Зелений колір</p>
                <p className="text-sm">Буква на правильному місці</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🟨</span>
              <div>
                <p className="font-medium">Жовтий колір</p>
                <p className="text-sm">Буква є в слові, але на іншому місці</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⬜</span>
              <div>
                <p className="font-medium">Сірий колір</p>
                <p className="text-sm">Такої букви немає в слові</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <p className="font-medium">Підказка</p>
                <p className="text-sm">Натисніть на лампочку щоб дізнатися що означає слово</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="font-medium">Нагорода</p>
                <p className="text-sm">10 очків за успішне проходження гри</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
