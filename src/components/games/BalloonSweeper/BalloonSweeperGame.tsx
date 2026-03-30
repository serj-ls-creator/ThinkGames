'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useMemo, useState, useEffect, useRef } from 'react'
import {
  BalloonCell,
  BalloonDifficulty,
  createBalloonBoard,
  hasWonBalloonSweeper,
  openArea,
  revealAllMines,
} from '../../../lib/balloonSweeper'
import { saveGameResult } from '../../../lib/points'
import { useAuth } from '../../../context/AuthContext'

type PlayMode = 'open' | 'flag'
type GameStatus = 'idle' | 'playing' | 'won' | 'lost'

interface BalloonSweeperGameProps {
  difficulty: BalloonDifficulty
}

const createEmptyBoard = (difficulty: BalloonDifficulty): BalloonCell[] => {
  const cells: BalloonCell[] = []

  for (let row = 0; row < difficulty.rows; row += 1) {
    for (let col = 0; col < difficulty.cols; col += 1) {
      cells.push({
        id: `${row}-${col}`,
        row,
        col,
        hasMine: false,
        isOpen: false,
        isFlagged: false,
        adjacentMines: 0,
      })
    }
  }

  return cells
}

const numberColors: Record<number, string> = {
  1: 'text-sky-600',
  2: 'text-emerald-600',
  3: 'text-rose-500',
  4: 'text-violet-600',
  5: 'text-amber-600',
  6: 'text-cyan-600',
  7: 'text-slate-700',
  8: 'text-fuchsia-600',
}

const getBoardMaxWidth = (difficulty: BalloonDifficulty) => {
  if (difficulty.cols <= 5) return 320
  if (difficulty.cols <= 7) return 380
  return 430
}

const getCellTextSize = (difficulty: BalloonDifficulty) => {
  if (difficulty.cols >= 9) return 'text-sm sm:text-base'
  if (difficulty.cols >= 7) return 'text-base sm:text-lg'
  return 'text-lg sm:text-xl'
}

export const BalloonSweeperGame: React.FC<BalloonSweeperGameProps> = ({ difficulty }) => {
  const { user } = useAuth()
  const [board, setBoard] = useState<BalloonCell[]>(() => createEmptyBoard(difficulty))
  const [status, setStatus] = useState<GameStatus>('idle')
  const [mode, setMode] = useState<PlayMode>('open')
  const [moves, setMoves] = useState(0)
  const [isBoardReady, setIsBoardReady] = useState(false)
  const hasSaved = useRef(false) // Защита от множественных сохранений

  const flaggedCount = useMemo(() => board.filter((cell) => cell.isFlagged).length, [board])
  const hiddenSafeCells = useMemo(
    () => board.filter((cell) => !cell.hasMine && !cell.isOpen).length,
    [board]
  )
  const boardMaxWidth = getBoardMaxWidth(difficulty)
  const cellTextSize = getCellTextSize(difficulty)

  // Сохранение очков при победе
  useEffect(() => {
    if (status === 'won' && !hasSaved.current && user?.id) {
      hasSaved.current = true;
      saveGameResult(user.id, 'math', 10, false);
      console.log('!!! BALLOON SWEEPER COMPLETE: 10 XP SENT !!!');
    }
  }, [status, user?.id]);

  const resetGame = () => {
    setBoard(createEmptyBoard(difficulty))
    setStatus('idle')
    setMode('open')
    setMoves(0)
    setIsBoardReady(false)
    hasSaved.current = false // Сброс флага сохранения
  }

  const handleCellPress = (cell: BalloonCell) => {
    if (status === 'won' || status === 'lost') return

    const activeCell = board.find((item) => item.id === cell.id)
    if (!activeCell || activeCell.isOpen) return

    if (mode === 'flag') {
      if (!isBoardReady) return

      setBoard((currentBoard) =>
        currentBoard.map((item) =>
          item.id === cell.id
            ? {
                ...item,
                isFlagged: !item.isFlagged,
              }
            : item
        )
      )
      return
    }

    let workingBoard = board.map((item) => ({ ...item }))

    if (!isBoardReady) {
      workingBoard = createBalloonBoard(difficulty, { row: cell.row, col: cell.col })
      setIsBoardReady(true)
      setStatus('playing')
    }

    const targetCell = workingBoard.find((item) => item.id === cell.id)
    if (!targetCell || targetCell.isFlagged) return

    if (targetCell.hasMine) {
      const nextBoard = revealAllMines(
        workingBoard.map((item) =>
          item.id === cell.id
            ? {
                ...item,
                isOpen: true,
              }
            : item
        )
      )
      setBoard(nextBoard)
      setMoves((value) => value + 1)
      setStatus('lost')
      return
    }

    const nextBoard = openArea(workingBoard, cell.id, difficulty)
    const nextStatus = hasWonBalloonSweeper(nextBoard) ? 'won' : 'playing'

    setBoard(nextBoard)
    setMoves((value) => value + 1)
    setStatus(nextStatus)
  }

  const statusCard = {
    idle: {
      title: 'Натисни на клітинку, щоб почати',
      text: 'Перший хід завжди безпечний. Цифри поруч підказують, де заховалися небезпечні кульки.',
      color: 'from-sky-400 to-cyan-400',
    },
    playing: {
      title: 'Шукаємо приховані кульки',
      text: 'Перемикай режим угорі: відкривати клітинки або ставити прапорець.',
      color: 'from-emerald-400 to-teal-400',
    },
    won: {
      title: 'Ура, поле очищено!',
      text: 'Усі безпечні клітинки відкрито. Можна зіграти ще раз або обрати інший рівень.',
      color: 'from-yellow-400 to-orange-400',
    },
    lost: {
      title: 'Кулька луснула',
      text: 'Нічого страшного. Спробуй ще раз, тепер поле вже виглядає знайомішим.',
      color: 'from-rose-400 to-pink-400',
    },
  }[status]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEF8FF] via-[#F8FDFF] to-[#FFF6EC] px-4 py-6">
      <div className="mx-auto max-w-xl pb-8">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6 text-center"
        >
          <Link
            href="/math/balloon-sweeper"
            className="mb-5 inline-flex items-center rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-slate-700 shadow-md transition-colors hover:text-sky-700"
          >
            ← Назад до рівнів
          </Link>

          <h1 className="mb-2 text-3xl font-bold text-slate-900 sm:text-4xl">Кульковий сапер</h1>
          <p className="text-sm text-slate-700 sm:text-base">
            {difficulty.label} рівень • {difficulty.rows} × {difficulty.cols} • {difficulty.mines} небезпечних кульок
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className={`mb-5 rounded-3xl bg-gradient-to-r p-5 text-slate-950 shadow-xl ${statusCard.color}`}
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold" style={{ color: '#0f172a' }}>{statusCard.title}</h2>
              <p className="mt-1 text-sm font-medium" style={{ color: '#1e293b' }}>{statusCard.text}</p>
            </div>
            <div className="text-4xl">{status === 'won' ? '🏆' : status === 'lost' ? '🎈' : '🫧'}</div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-white/90 px-3 py-3 shadow-sm">
              <div className="text-xs uppercase tracking-wide" style={{ color: '#475569' }}>Ходи</div>
              <div className="mt-1 text-xl font-bold" style={{ color: '#0f172a' }}>{moves}</div>
            </div>
            <div className="rounded-2xl bg-white/90 px-3 py-3 shadow-sm">
              <div className="text-xs uppercase tracking-wide" style={{ color: '#475569' }}>Прапорці</div>
              <div className="mt-1 text-xl font-bold" style={{ color: '#0f172a' }}>
                {flaggedCount}/{difficulty.mines}
              </div>
            </div>
            <div className="rounded-2xl bg-white/90 px-3 py-3 shadow-sm">
              <div className="text-xs uppercase tracking-wide" style={{ color: '#475569' }}>Залишилось</div>
              <div className="mt-1 text-xl font-bold" style={{ color: '#0f172a' }}>{hiddenSafeCells}</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="mb-5 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-lg"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold" style={{ color: '#0f172a' }}>Режим натискання</h2>
              <p className="text-sm" style={{ color: '#334155' }}>На телефоні це замінює праву кнопку миші.</p>
            </div>
            <button
              type="button"
              onClick={resetGame}
              className="rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-200"
            >
              Почати знову
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode('open')}
              className="rounded-2xl border px-4 py-3 text-sm font-semibold transition-all"
              style={
                mode === 'open'
                  ? {
                      backgroundColor: '#0ea5e9',
                      borderColor: '#0ea5e9',
                      color: '#ffffff',
                      boxShadow: '0 10px 24px rgba(14, 165, 233, 0.28)',
                    }
                  : {
                      backgroundColor: '#e2e8f0',
                      borderColor: '#cbd5e1',
                      color: '#0f172a',
                    }
              }
            >
              Відкривати
            </button>
            <button
              type="button"
              onClick={() => setMode('flag')}
              className="rounded-2xl border px-4 py-3 text-sm font-semibold transition-all"
              style={
                mode === 'flag'
                  ? {
                      backgroundColor: '#f59e0b',
                      borderColor: '#f59e0b',
                      color: '#ffffff',
                      boxShadow: '0 10px 24px rgba(245, 158, 11, 0.28)',
                    }
                  : {
                      backgroundColor: '#e2e8f0',
                      borderColor: '#cbd5e1',
                      color: '#0f172a',
                    }
              }
            >
              Прапорець
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="mx-auto rounded-[2rem] bg-white/90 p-2.5 shadow-2xl sm:p-3"
          style={{ width: 'min(100%, calc(100vw - 2rem))', maxWidth: `${boardMaxWidth}px` }}
        >
          <div
            className="grid gap-1.5 sm:gap-2"
            style={{ gridTemplateColumns: `repeat(${difficulty.cols}, minmax(0, 1fr))` }}
          >
            {board.map((cell) => {
              const isOpen = cell.isOpen
              const isMine = cell.hasMine && isOpen

              return (
                <motion.button
                  key={cell.id}
                  whileTap={{ scale: 0.94 }}
                  type="button"
                  onClick={() => handleCellPress(cell)}
                  className={`aspect-square rounded-xl border font-bold transition-all sm:rounded-2xl ${cellTextSize} ${
                    isOpen
                      ? isMine
                        ? 'border-rose-200 bg-rose-100'
                        : 'border-sky-100 bg-sky-50'
                      : 'border-sky-100 bg-gradient-to-br from-white to-sky-100 shadow-sm hover:from-sky-50 hover:to-sky-200'
                  }`}
                >
                  {isOpen ? (
                    isMine ? (
                      <span aria-label="Кулька луснула">💥</span>
                    ) : cell.adjacentMines > 0 ? (
                      <span className={numberColors[cell.adjacentMines]}>{cell.adjacentMines}</span>
                    ) : (
                      <span aria-hidden="true">☁️</span>
                    )
                  ) : cell.isFlagged ? (
                    <span aria-label="Прапорець">🚩</span>
                  ) : (
                    <span aria-hidden="true">🎈</span>
                  )}
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
