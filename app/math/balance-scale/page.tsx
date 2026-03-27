'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LevelSelectorSimple } from '../../../components/LevelSelectorSimple'
import { BALANCE_LEVELS } from '../../../src/lib/balanceScale'

export default function BalanceScalePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7E8] via-[#FFFDFC] to-[#EEF7FF] px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 text-center"
        >
          <Link
            href="/math"
            className="mb-6 inline-flex items-center rounded-full bg-white/90 px-4 py-2 text-slate-600 shadow-md transition-colors hover:text-amber-600"
          >
            ← Назад до ігор
          </Link>

          <h1 className="mb-4 text-4xl font-bold text-slate-800 md:text-5xl">Ваги рівноваги</h1>

          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            На одній шальці вже стоїть число, а ти добираєш комбінацію гир на другій, щоб
            зрівняти ваги та краще відчути, як працюють рівності.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-[2rem] bg-white/85 p-6 shadow-xl"
        >
          <LevelSelectorSimple
            levels={BALANCE_LEVELS}
            colorTheme="orange"
            onLevelSelect={(level) => router.push(`/math/balance-scale/${level}`)}
          />
        </motion.div>
      </div>
    </div>
  )
}
