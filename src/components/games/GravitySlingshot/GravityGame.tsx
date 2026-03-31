'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../../context/AuthContext'
import { saveGameResult } from '../../../lib/points'
import GameEndModal from '../../../components/GameEndModal'
import { 
  generateLevel, 
  updatePhysics, 
  GameState, 
  Ship, 
  Asteroid,
  PLANET_RADIUS,
  SHIP_RADIUS,
  ASTEROID_RADIUS
} from '../../../lib/gravityGame'

export default function GravityGame({ level }: { level: number }) {
  const { user } = useAuth()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  const keysRef = useRef<Set<string>>(new Set())
  const hasSaved = useRef(false)
  
  const [gameState, setGameState] = useState<GameState>(() => generateLevel(level))
  const [isPaused, setIsPaused] = useState(false)

  // Сброс игры
  const resetGame = useCallback(() => {
    setGameState(generateLevel(level))
    setIsPaused(false)
    hasSaved.current = false
    lastTimeRef.current = 0
  }, [level])

  // Обработка клавиатуры
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase())
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase())
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Обработка касаний для мобильных устройств
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = touch.clientX - rect.left - rect.width / 2
    const y = touch.clientY - rect.top - rect.height / 2

    // Определяем, где было касание относительно центра
    const angle = Math.atan2(y, x)
    
    setGameState(prev => ({
      ...prev,
      ship: {
        ...prev.ship,
        angle: angle,
        thrust: true
      }
    }))
  }, [])

  const handleTouchEnd = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      ship: {
        ...prev.ship,
        thrust: false
      }
    }))
  }, [])

  // Сохранение очков при победе
  useEffect(() => {
    if (gameState.status === 'won' && !hasSaved.current && user?.id) {
      hasSaved.current = true
      saveGameResult(user.id, 'math', 10, false)
      console.log('!!! GRAVITY GAME COMPLETE: 10 XP SENT !!!')
    }
  }, [gameState.status, user?.id])

  // Игровой цикл
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const gameLoop = (currentTime: number) => {
      if (isPaused || gameState.status !== 'playing') {
        animationRef.current = requestAnimationFrame(gameLoop)
        return
      }

      const deltaTime = Math.min((currentTime - lastTimeRef.current) / 1000, 0.1)
      lastTimeRef.current = currentTime

      // Обновляем состояние корабля на основе клавиатуры
      setGameState(prevState => {
        const newState = { ...prevState }
        const ship = { ...newState.ship }

        // Управление кораблем
        if (keysRef.current.has('arrowleft') || keysRef.current.has('a')) {
          ship.angle -= 0.1
        }
        if (keysRef.current.has('arrowright') || keysRef.current.has('d')) {
          ship.angle += 0.1
        }
        ship.thrust = keysRef.current.has('arrowup') || keysRef.current.has('w') || keysRef.current.has(' ')

        newState.ship = ship

        // Обновляем физику
        return updatePhysics(newState, deltaTime * 60) // Нормализуем deltaTime
      })

      animationRef.current = requestAnimationFrame(gameLoop)
    }

    animationRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPaused, gameState.status])

  // Рендеринг игры
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Очистка canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Сохраняем состояние контекста
    ctx.save()

    // Перемещаем центр координат в центр canvas
    ctx.translate(canvas.width / 2, canvas.height / 2)

    // Рисуем планету
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, PLANET_RADIUS)
    gradient.addColorStop(0, '#8B5CF6')
    gradient.addColorStop(0.7, '#7C3AED')
    gradient.addColorStop(1, '#6D28D9')
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(0, 0, PLANET_RADIUS, 0, Math.PI * 2)
    ctx.fill()

    // Рисуем число на планете
    ctx.fillStyle = 'white'
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(gameState.planetNumber.toString(), 0, 0)

    // Рисуем астероиды
    gameState.asteroids.forEach(asteroid => {
      ctx.save()
      ctx.translate(asteroid.x, asteroid.y)

      // Фон астероида
      const asteroidGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, asteroid.radius)
      if (asteroid.isCorrect) {
        asteroidGradient.addColorStop(0, '#10B981')
        asteroidGradient.addColorStop(1, '#059669')
      } else {
        asteroidGradient.addColorStop(0, '#EF4444')
        asteroidGradient.addColorStop(1, '#DC2626')
      }
      
      ctx.fillStyle = asteroidGradient
      ctx.beginPath()
      ctx.arc(0, 0, asteroid.radius, 0, Math.PI * 2)
      ctx.fill()

      // Текст на астероиде
      ctx.fillStyle = 'white'
      ctx.font = 'bold 12px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(asteroid.expression, 0, 0)

      ctx.restore()
    })

    // Рисуем корабль
    ctx.save()
    ctx.translate(gameState.ship.x, gameState.ship.y)
    ctx.rotate(gameState.ship.angle)

    // Корпус корабля
    ctx.fillStyle = '#3B82F6'
    ctx.beginPath()
    ctx.moveTo(SHIP_RADIUS, 0)
    ctx.lineTo(-SHIP_RADIUS, -SHIP_RADIUS * 0.7)
    ctx.lineTo(-SHIP_RADIUS * 0.5, 0)
    ctx.lineTo(-SHIP_RADIUS, SHIP_RADIUS * 0.7)
    ctx.closePath()
    ctx.fill()

    // Огонь двигателя
    if (gameState.ship.thrust) {
      ctx.fillStyle = '#FCD34D'
      ctx.beginPath()
      ctx.moveTo(-SHIP_RADIUS * 0.5, -SHIP_RADIUS * 0.3)
      ctx.lineTo(-SHIP_RADIUS * 1.5, 0)
      ctx.lineTo(-SHIP_RADIUS * 0.5, SHIP_RADIUS * 0.3)
      ctx.closePath()
      ctx.fill()
    }

    ctx.restore()

    // Восстанавливаем состояние контекста
    ctx.restore()

    // Рисуем UI
    ctx.fillStyle = '#1F2937'
    ctx.font = 'bold 20px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`Рівень: ${gameState.level}`, 20, 30)
    ctx.fillText(`Зібрано: ${gameState.score}/5`, 20, 60)

  }, [gameState])

  const handleSelectLevel = () => {
    window.location.href = '/math/gravity-slingshot'
  }

  const handleMainMenu = () => {
    window.location.href = '/math'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEE9FF] via-[#F5F0FF] to-[#FAF5FF] flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Орбітальна Арифметика</h1>
          <p className="text-gray-600">
            Зберіть 5 правильних астероїдів, які дорівнюють числу на планеті
          </p>
        </motion.div>

        {/* Игровое поле */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-white rounded-2xl shadow-2xl p-4"
        >
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full h-auto max-w-full rounded-lg border-2 border-purple-200"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />

          {/* Управление для десктопа */}
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>Управління: ↑/W або Пробіл - тяга, ←/A →/D - поворот</p>
          </div>

          {/* Управление для мобильных */}
          <div className="mt-2 text-center text-sm text-gray-600 md:hidden">
            <p>Торкніться екрана для управління кораблем</p>
          </div>
        </motion.div>

        {/* Модальное окно завершения игры */}
        <GameEndModal
          isOpen={gameState.status === 'won' || gameState.status === 'lost'}
          isWon={gameState.status === 'won'}
          onPlayAgain={resetGame}
          onSelectLevel={handleSelectLevel}
          onMainMenu={handleMainMenu}
          title={gameState.status === 'won' ? 'Чудово!' : 'Гра закінчена'}
          winMessage={`Ви зібрали всі правильні астероїди! Число планети: ${gameState.planetNumber}`}
          loseMessage={gameState.status === 'lost' ? 'Ви зіткнулися з неправильним астероїдом або планетою!' : 'Спробуйте ще раз!'}
          playAgainText="Грати знову"
          mainMenuText="В головне меню"
          hasLevels={true}
          levelSelectHref="/math/gravity-slingshot"
          showCurrentLevel={false}
        />
      </div>
    </div>
  )
}
