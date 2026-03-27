'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LevelSelectorSimple } from '../../../components/LevelSelectorSimple'
import { BALLOON_DIFFICULTIES } from '../../../src/lib/balloonSweeper'

export default function BalloonSweeperPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEF8FF] via-[#F8FDFF] to-[#FFF6EC] px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 text-center"
        >
          <Link
            href="/math"
            className="mb-6 inline-flex items-center rounded-full bg-white/90 px-4 py-2 text-slate-600 shadow-md transition-colors hover:text-sky-600"
          >
            ← Назад до ігор
          </Link>

          <h1 className="mb-4 text-4xl font-bold text-slate-800 md:text-5xl">Кульковий сапер</h1>

          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Класичний сапер у м&apos;якому дитячому стилі: відкривай клітинки, читай підказки
            цифрами та позначай небезпечні кульки прапорцями.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-[2rem] bg-white/85 p-6 shadow-xl"
        >
          <LevelSelectorSimple
            levels={BALLOON_DIFFICULTIES.map((difficulty, index) => ({
              value: index,
              label: difficulty.label,
              description: difficulty.description,
            }))}
            colorTheme="orange"
            onLevelSelect={(index) => {
              const difficulty = BALLOON_DIFFICULTIES[index]
              if (difficulty) {
                router.push(`/math/balloon-sweeper/${difficulty.key}`)
              }
            }}
          />
        </motion.div>
      </div>
    </div>
  )
}
