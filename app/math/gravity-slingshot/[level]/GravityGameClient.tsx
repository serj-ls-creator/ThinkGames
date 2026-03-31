'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../../../src/context/AuthContext'
import { saveGameResult } from '../../../../src/lib/points'
import GameEndModal from '../../../../src/components/GameEndModal'
import Joystick from '../../../../src/components/ui/Joystick'
import { 
  generateLevel, 
  updatePhysics, 
  applyBoundaryForces, 
  GameState, 
  Ship, 
  Asteroid,
  GRAVITY_LEVELS,
  PLANET_RADIUS,
  SHIP_RADIUS,
  ASTEROID_RADIUS
} from '../../../../src/lib/gravityGame'

export default function GravityGameClient({ level }: { level: number }) {
  const { user } = useAuth()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  const keysRef = useRef<Set<string>>(new Set())
  const hasSaved = useRef(false)
  
  const [gameState, setGameState] = useState<GameState>(() => generateLevel(level))
  const [isPaused, setIsPaused] = useState(false)
  const [joystickVector, setJoystickVector] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const [wallHit, setWallHit] = useState(false)

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      const mobile = true // Временно для всех устройств
      setIsMobile(mobile)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Обработка джойстика
  const handleJoystickMove = useCallback((vector: { x: number, y: number }) => {
    setJoystickVector(vector)
  }, [])

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

  // Обработка касаний для мобильных устройств (полностью отключена - используем только джойстик)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Полностью отключаем touch-управление на всех устройствах
    return
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    // Полностью отключаем touch-управление на всех устройствах
    return
  }, [])

  const handleTouchEnd = useCallback(() => {
    // Полностью отключаем touch-управление на всех устройствах
    return
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

      // Обновляем состояние корабля на основе клавиатуры и джойстика
      setGameState(prevState => {
        const newState = { ...prevState }
        const ship = { ...newState.ship }

        // Управление кораблем (джойстик всегда работает, клавиатура - когда не touch)
        const hasTouch = 'ontouchstart' in window
        
        if (!hasTouch) {
          // Клавиатура для десктопа
          if (keysRef.current.has('arrowleft') || keysRef.current.has('a')) {
            ship.angle -= 0.1
          }
          if (keysRef.current.has('arrowright') || keysRef.current.has('d')) {
            ship.angle += 0.1
          }
          ship.thrust = keysRef.current.has('arrowup') || keysRef.current.has('w') || keysRef.current.has(' ')
        }
        
        // Джойстик работает всегда (и на десктопе, и на мобильных)
        if (joystickVector.x !== 0 || joystickVector.y !== 0) {
          // Вычисляем угол на основе вектора джойстика
          ship.angle = Math.atan2(joystickVector.y, joystickVector.x)
          // Сила тяги пропорциональна расстоянию от центра
          const joystickMagnitude = Math.sqrt(joystickVector.x * joystickVector.x + joystickVector.y * joystickVector.y)
          ship.thrust = joystickMagnitude > 0.1
        } else {
          // Если джойстик не используется, выключаем тягу
          if (hasTouch) {
            ship.thrust = false
          }
        }

        newState.ship = ship

        // ПРЯМОЕ ЗАМЕДЛЕНИЕ ПЕРЕД ОТРИСОВКОЙ (максимально простой подход)
        const halfWidth = 290  // Чуть меньше реальных границ
        const halfHeight = 190 // Чуть меньше реальных границ
        
        let wallHit = false
        
        if (newState.ship.x - SHIP_RADIUS < -halfWidth) {
          newState.ship.x = -halfWidth + SHIP_RADIUS
          newState.ship.vx = Math.abs(newState.ship.vx) * 0.25 // Просто замедляем в 4 раза
          newState.ship.vy *= 0.25
          wallHit = true
        }
        if (newState.ship.x + SHIP_RADIUS > halfWidth) {
          newState.ship.x = halfWidth - SHIP_RADIUS
          newState.ship.vx = -Math.abs(newState.ship.vx) * 0.25 // Просто замедляем в 4 раза
          newState.ship.vy *= 0.25
          wallHit = true
        }
        if (newState.ship.y - SHIP_RADIUS < -halfHeight) {
          newState.ship.y = -halfHeight + SHIP_RADIUS
          newState.ship.vy = Math.abs(newState.ship.vy) * 0.25 // Просто замедляем в 4 раза
          newState.ship.vx *= 0.25
          wallHit = true
        }
        if (newState.ship.y + SHIP_RADIUS > halfHeight) {
          newState.ship.y = halfHeight - SHIP_RADIUS
          newState.ship.vy = -Math.abs(newState.ship.vy) * 0.25 // Просто замедляем в 4 раза
          newState.ship.vx *= 0.25
          wallHit = true
        }

        // Обновляем wallHit в состоянии
        newState.wallHit = wallHit

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
  }, [isPaused, gameState.status, joystickVector]) // Добавил joystickVector в зависимости

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
    gradient.addColorStop(0, '#FCD34D')
    gradient.addColorStop(0.7, '#F59E0B')
    gradient.addColorStop(1, '#D97706')
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(0, 0, PLANET_RADIUS, 0, Math.PI * 2)
    ctx.fill()

    // Рисуем число на планете
    ctx.fillStyle = '#1F2937'
    ctx.font = 'bold 32px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(gameState.planetNumber.toString(), 0, 0)

    // Рисуем астероиды
    gameState.asteroids.forEach(asteroid => {
      ctx.save()
      ctx.translate(asteroid.x, asteroid.y)

      // Фон астероида с индивидуальным цветом
      const asteroidGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, asteroid.radius)
      asteroidGradient.addColorStop(0, asteroid.color)
      asteroidGradient.addColorStop(1, asteroid.color)
      
      ctx.fillStyle = asteroidGradient
      ctx.beginPath()
      ctx.arc(0, 0, asteroid.radius, 0, Math.PI * 2)
      ctx.fill()

      // Текст на астероиде
      ctx.fillStyle = 'white'
      ctx.font = 'bold 16px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(asteroid.expression, 0, 0)

      ctx.restore()
    })

    // Рисуем корабль с учетом wallHit
    ctx.save()
    ctx.translate(gameState.ship.x, gameState.ship.y)
    ctx.rotate(gameState.ship.angle)

    // Корабль меняет цвет при столкновении со стеной
    const shipColor = gameState.wallHit ? '#EF4444' : '#3B82F6'
    
    // Корпус корабля
    ctx.fillStyle = shipColor
    ctx.beginPath()
    ctx.moveTo(SHIP_RADIUS, 0)
    ctx.lineTo(-SHIP_RADIUS, -SHIP_RADIUS * 0.7)
    ctx.lineTo(-SHIP_RADIUS * 0.5, 0)
    ctx.lineTo(-SHIP_RADIUS, SHIP_RADIUS * 0.7)
    ctx.closePath()
    ctx.fill()

    // Огонь при тяге
    if (gameState.ship.thrust) {
      const flameGradient = ctx.createLinearGradient(-SHIP_RADIUS, 0, -SHIP_RADIUS * 1.5, 0)
      flameGradient.addColorStop(0, '#FCD34D')
      flameGradient.addColorStop(0.5, '#F59E0B')
      flameGradient.addColorStop(1, '#DC2626')
      
      ctx.fillStyle = flameGradient
      ctx.beginPath()
      ctx.moveTo(-SHIP_RADIUS * 0.5, -SHIP_RADIUS * 0.3)
      ctx.lineTo(-SHIP_RADIUS * 1.5, 0)
      ctx.lineTo(-SHIP_RADIUS * 0.5, SHIP_RADIUS * 0.3)
      ctx.closePath()
      ctx.fill()
    }

    ctx.restore()

    // Рисуем границы карты
    ctx.strokeStyle = '#E5E7EB'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5]) // Пунктирная линия
    ctx.strokeRect(-300, -200, 600, 400)
    ctx.setLineDash([]) // Сбрасываем пунктир

    // Восстанавливаем состояние контекста
    ctx.restore()

  }, [gameState])

  const handleSelectLevel = () => {
    window.location.href = '/math/gravity-slingshot'
  }

  const handleMainMenu = () => {
    window.location.href = '/math'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex flex-col items-center justify-center p-4">
      {/* Красивый заголовок для детей */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
          🚀 Орбітальна Арифметика 🌟
        </h1>
        <p className="text-lg md:text-xl text-gray-700 font-medium">
          {gameState.level === 1 ? 'Зберіть 1 правильний астероїд для планети!' : 
           gameState.level === 2 ? 'Зберіть 2 правильних астероїди для планети!' : 
           'Зберіть 2 правильних астероїди для планети!'}
        </p>
      </motion.div>

      {/* Панель с уровнем и счетом над игрой */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="mb-4 flex flex-wrap gap-4 justify-center"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg px-6 py-3 border-2 border-purple-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <div>
              <p className="text-xs text-gray-600 font-medium">Рівень</p>
              <p className="text-xl font-bold text-purple-600">{gameState.level}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg px-6 py-3 border-2 border-pink-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <div>
              <p className="text-xs text-gray-600 font-medium">Зібрано</p>
              <p className="text-xl font-bold text-pink-600">{gameState.score}/{gameState.level === 1 ? 1 : gameState.level === 2 ? 2 : 2}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg px-6 py-3 border-2 border-blue-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🪐</span>
            <div>
              <p className="text-xs text-gray-600 font-medium">Планета</p>
              <p className="text-xl font-bold text-blue-600">{gameState.planetNumber}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Игровое поле с красивой рамкой */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, duration: 0.4, type: "spring" }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 to-blue-400 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
        <div className="relative bg-white rounded-3xl shadow-2xl p-6 border-4 border-white/50">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="w-full h-auto max-w-full rounded-2xl border-2 border-purple-200"
            style={{ touchAction: 'none' }}
          />
        </div>
      </motion.div>

        {/* Управление для мобильных с джойстиком */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="mt-4 flex flex-col items-center gap-2"
        >
          <div className="relative">
            <Joystick 
              onMove={handleJoystickMove}
              size={100}
              stickSize={32}
            />
          </div>
        </motion.div>

        {/* Кнопки управления */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          className="mt-6 flex gap-4 justify-center"
        >
          <button
            onClick={handleSelectLevel}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <span>🎯</span>
            Вибрати рівень
          </button>
          <button
            onClick={handleMainMenu}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <span>🏠</span>
            Головне меню
          </button>
        </motion.div>

      {/* Модальное окно конца игры */}
      <AnimatePresence>
        {gameState.status === 'won' && (
          <GameEndModal
            isOpen={true}
            isWon={true}
            onPlayAgain={() => resetGame()}
            onSelectLevel={handleSelectLevel}
            onMainMenu={handleMainMenu}
            title="Рівень пройдено!"
            winMessage="Чудово!"
            playAgainText="Грати ще раз"
            selectLevelText="Вибрати рівень"
            mainMenuText="В головне меню"
            showCurrentLevel={false} // Исправлено: не показывать текущий уровень
          />
        )}
        {gameState.status === 'lost' && (
          <GameEndModal
            isOpen={true}
            isWon={false}
            onPlayAgain={() => resetGame()}
            onSelectLevel={handleSelectLevel}
            onMainMenu={handleMainMenu}
            title="Спробуйте ще раз!"
            loseMessage="Не вдалося"
            playAgainText="Спробувати ще раз"
            selectLevelText="Вибрати рівень"
            mainMenuText="В головне меню"
            showCurrentLevel={false} // Исправлено: не показывать текущий уровень
          />
        )}
      </AnimatePresence>
    </div>
  )
}
