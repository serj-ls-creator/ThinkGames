'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useMemo, useState, useRef } from 'react'
import { BALANCE_LEVELS, BalanceWeight, generateBalanceRound } from '../../../lib/balanceScale'
import { saveGameResult } from '../../../lib/points'
import { useAuth } from '../../../context/AuthContext'

interface BalanceScaleGameProps {
  maxValue: number
}

const getLevelLabel = (maxValue: number) =>
  BALANCE_LEVELS.find((level) => level.value === maxValue)?.label ?? `До ${maxValue}`

const WeightBadge = ({
  value,
  large = false,
  active = false,
}: {
  value: number
  large?: boolean
  active?: boolean
}) => (
  <div className={`relative inline-flex flex-col items-center ${large ? 'scale-95 sm:scale-100' : 'scale-90 sm:scale-100'}`}>
    <div
      className={`${large ? 'h-3 w-6' : 'h-2.5 w-5'} rounded-full border`}
      style={{
        borderColor: active ? '#020617' : '#111827',
        backgroundColor: active ? '#020617' : '#111827',
      }}
    />
    <div
      className={`-mt-1 rounded-[1rem] px-3 shadow-md ${large ? 'min-w-12 py-2 text-lg' : 'min-w-9 py-1 text-sm'}`}
      style={{
        background: 'linear-gradient(180deg, #374151 0%, #111827 55%, #020617 100%)',
        boxShadow: '0 8px 18px rgba(15, 23, 42, 0.24)',
      }}
    >
      <div className="text-center font-black text-slate-50">{value}</div>
    </div>
  </div>
)

export const BalanceScaleGame: React.FC<BalanceScaleGameProps> = ({ maxValue }) => {
  const { user } = useAuth()
  const [round, setRound] = useState(() => generateBalanceRound(maxValue))
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showWinMessage, setShowWinMessage] = useState(false)
  const hasSaved = useRef(false) // Защита от множественных сохранений

  const selectedWeights = useMemo(
    () => round.availableWeights.filter((weight) => selectedIds.includes(weight.id)),
    [round.availableWeights, selectedIds]
  )

  const selectedSum = useMemo(
    () => selectedWeights.reduce((sum, weight) => sum + weight.value, 0),
    [selectedWeights]
  )

  const difference = round.target - selectedSum
  const isBalanced = difference === 0
  const tiltStrength = Math.min(Math.abs(difference) / Math.max(round.target, 1), 1)
  const beamAngle = isBalanced ? 0 : (difference > 0 ? -1 : 1) * (4 + tiltStrength * 10)
  const cupTravel = isBalanced ? 0 : 10 + tiltStrength * 22
  const leftCupOffset = isBalanced ? 0 : difference > 0 ? cupTravel : -cupTravel
  const rightCupOffset = isBalanced ? 0 : difference > 0 ? -cupTravel : cupTravel

  useEffect(() => {
    if (!isBalanced) {
      setShowWinMessage(false)
      return
    }

    const timeoutId = window.setTimeout(() => {
      setShowWinMessage(true)
    }, 2000)

    return () => window.clearTimeout(timeoutId)
  }, [isBalanced, round.target, selectedIds])

  // Сохранение очков при победе
  useEffect(() => {
    if (showWinMessage && !hasSaved.current && user?.id) {
      hasSaved.current = true;
      saveGameResult(user.id, 'math', 10, false);
      console.log('!!! BALANCE SCALE COMPLETE: 10 XP SENT !!!');
    }
  }, [showWinMessage, user?.id]);

  const handleWeightToggle = (weight: BalanceWeight) => {
    if (showWinMessage) return

    setSelectedIds((current) =>
      current.includes(weight.id) ? current.filter((id) => id !== weight.id) : [...current, weight.id]
    )
  }

  const handleNextRound = () => {
    setRound(generateBalanceRound(maxValue))
    setSelectedIds([])
    setShowWinMessage(false)
    hasSaved.current = false // Сброс флага сохранения
  }

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-[#FFF7E8] via-[#FFFDFC] to-[#EEF7FF] px-3 py-3 sm:px-4 sm:py-4">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-4xl flex-col">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-2 flex items-center justify-between gap-3"
        >
          <Link
            href="/math/balance-scale"
            className="inline-flex items-center rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-md transition-colors hover:text-amber-700 sm:text-sm"
          >
            ← Назад
          </Link>

          <div className="text-center">
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Ваги рівноваги</h1>
            <p className="text-xs text-slate-600 sm:text-sm">{getLevelLabel(maxValue)}</p>
          </div>

          <button
            type="button"
            onClick={handleNextRound}
            className="rounded-full bg-amber-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-amber-600 sm:text-sm"
          >
            Новий раунд
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="relative mb-3 rounded-[1.6rem] border border-slate-200 bg-white p-3 shadow-xl sm:p-4"
        >
          <div className="relative mx-auto w-full max-w-3xl overflow-visible aspect-[760/330] min-h-[220px]">
            <svg viewBox="0 0 760 330" className="block h-full w-full">
              <g transform={`rotate(${beamAngle} 380 168)`}>
                <rect x="150" y="162" width="460" height="14" rx="7" fill="#020617" />
                <line x1="205" y1="170" x2="205" y2="88" stroke="#0f172a" strokeWidth="6" />
                <line x1="555" y1="170" x2="555" y2="88" stroke="#0f172a" strokeWidth="6" />
              </g>

              <g transform={`translate(0 ${leftCupOffset})`}>
                <rect x="126" y="72" width="158" height="16" rx="8" fill="#020617" />
                <path d="M136 92H274C270 126 242 144 206 144C168 144 140 126 136 92Z" fill="#020617" />
                <circle cx="205" cy="170" r="16" fill="#020617" />
                <circle cx="205" cy="170" r="8" fill="white" />
                {/* Центрируем гирю точно над чашей */}
                <foreignObject x="153" y="15" width="104" height="70">
                  <div className="flex h-full w-full items-end justify-center">
                    <WeightBadge value={round.target} large={true} active={true} />
                  </div>
                </foreignObject>
              </g>

              <g transform={`translate(0 ${rightCupOffset})`}>
                <rect x="476" y="72" width="158" height="16" rx="8" fill="#020617" />
                <path d="M486 92H624C620 126 592 144 555 144C518 144 490 126 486 92Z" fill="#020617" />
                <circle cx="555" cy="170" r="16" fill="#020617" />
                <circle cx="555" cy="170" r="8" fill="white" />
                {/* Контейнер для выбранных гирь */}
                <foreignObject x="480" y="0" width="150" height="120">
                  <div className="flex h-full w-full flex-col-reverse items-center justify-start gap-1">
                    {selectedWeights.map((weight) => (
                      <WeightBadge key={weight.id} value={weight.value} />
                    ))}
                  </div>
                </foreignObject>
              </g>

              <circle cx="380" cy="168" r="34" fill="#020617" />
              <circle cx="380" cy="168" r="14" fill="white" />
              <path d="M350 196H410V280C410 306 397 320 380 326C363 320 350 306 350 280V196Z" fill="#020617" />
              <rect x="320" y="286" width="120" height="12" rx="6" fill="#020617" />
              <rect x="308" y="304" width="144" height="10" rx="5" fill="#020617" />
            </svg>
          </div>

          {showWinMessage && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-1/2 top-3 z-20 w-[min(92%,340px)] -translate-x-1/2 rounded-[1.4rem] border-2 border-emerald-400 bg-white p-4 text-center shadow-xl"
            >
              <h2 className="text-2xl font-black text-emerald-700">Вітаємо!</h2>
              <p className="mt-1 text-sm font-medium text-slate-800 sm:text-base">Ти правильно зрівняв ваги.</p>
              <button
                type="button"
                onClick={handleNextRound}
                className="mt-3 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
              >
                Далі
              </button>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-[1.6rem] border border-slate-200 bg-white p-3 shadow-lg sm:p-4"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-slate-900 sm:text-lg">Гирі</h2>
            <button
              type="button"
              onClick={() => {
                setSelectedIds([])
                setShowWinMessage(false)
              }}
              className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 sm:text-sm"
            >
              Очистити
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
            {round.availableWeights.map((weight) => {
              const isSelected = selectedIds.includes(weight.id)

              return (
                <button
                  key={weight.id}
                  type="button"
                  onClick={() => handleWeightToggle(weight)}
                  className={`flex items-center justify-center rounded-2xl border-2 px-2 py-3 transition-all ${
                    isSelected
                      ? 'border-slate-900 bg-slate-200 shadow-sm'
                      : 'border-slate-300 bg-slate-50 hover:border-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <WeightBadge value={weight.value} large={true} active={isSelected} />
                </button>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
