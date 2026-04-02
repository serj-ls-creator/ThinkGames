'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../../../src/context/AuthContext'
import { saveGameResult } from '../../../../src/lib/points'
import { generateLevel, GameState, PLANET_RADIUS, SHIP_RADIUS, ASTEROID_RADIUS, updatePhysics } from '../../../../src/lib/gravityGame'
import { getNextVariant, resetVariantIndex, LevelVariant } from '../../../../src/data/gravityGameLevels'
import GameEndModal from '../../../../src/components/GameEndModal'
import Joystick from '../../../../src/components/ui/Joystick'

type ToneOptions = {
  frequency: number
  duration: number
  type?: OscillatorType
  volume?: number
  delay?: number
}

const createAudioContext = () => {
  if (typeof window === 'undefined') return null

  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  return AudioContextClass ? new AudioContextClass() : null
}

export default function GravityGameClient({ level }: { level: number }) {
  const { user } = useAuth()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  const keysRef = useRef<Set<string>>(new Set())
  const hasSaved = useRef(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const lastThrustSoundAtRef = useRef(0)
  const lastWallSoundAtRef = useRef(0)
  const previousGameStateRef = useRef<Pick<GameState, 'score' | 'status' | 'wallHit'>>({
    score: 0,
    status: 'playing',
    wallHit: false
  })
  const boundaryContactRef = useRef({
    left: false,
    right: false,
    top: false,
    bottom: false
  })
  
  // Определяем размеры canvas в зависимости от устройства
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 440 })
  
  useEffect(() => {
    const checkDevice = () => {
      const isMobile = window.innerWidth < 768
      setCanvasSize(isMobile ? { width: 400, height: 450 } : { width: 600, height: 440 })
    }
    
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])
  
  const [gameState, setGameState] = useState<GameState>(() => {
    hasSaved.current = false // Сбрасываем флаг при инициализации
    return generateLevel(level, Date.now(), undefined, canvasSize.width, canvasSize.height)
  })
  const [isPaused, setIsPaused] = useState(false)
  const [joystickVector, setJoystickVector] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const [wallHit, setWallHit] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const playTones = useCallback((tones: ToneOptions[]) => {
    if (!soundEnabled) return

    const context = audioContextRef.current ?? createAudioContext()
    if (!context) return

    audioContextRef.current = context

    if (context.state === 'suspended') {
      void context.resume().catch(() => {})
    }

    const now = context.currentTime

    tones.forEach(({ frequency, duration, type = 'sine', volume = 0.04, delay = 0 }) => {
      const oscillator = context.createOscillator()
      const gainNode = context.createGain()
      const startAt = now + delay
      const stopAt = startAt + duration

      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, startAt)

      gainNode.gain.setValueAtTime(0.0001, startAt)
      gainNode.gain.exponentialRampToValueAtTime(volume, startAt + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, stopAt)

      oscillator.connect(gainNode)
      gainNode.connect(context.destination)

      oscillator.start(startAt)
      oscillator.stop(stopAt)
    })
  }, [soundEnabled])

  const playSuccessSound = useCallback(() => {
    playTones([
      { frequency: 740, duration: 0.08, type: 'triangle', volume: 0.05 },
      { frequency: 988, duration: 0.12, type: 'triangle', volume: 0.05, delay: 0.08 }
    ])
  }, [playTones])

  const playFailSound = useCallback(() => {
    playTones([
      { frequency: 220, duration: 0.12, type: 'sawtooth', volume: 0.05 },
      { frequency: 160, duration: 0.18, type: 'sawtooth', volume: 0.045, delay: 0.08 }
    ])
  }, [playTones])

  const playWinSound = useCallback(() => {
    playTones([
      { frequency: 523.25, duration: 0.1, type: 'triangle', volume: 0.05 },
      { frequency: 659.25, duration: 0.1, type: 'triangle', volume: 0.05, delay: 0.1 },
      { frequency: 783.99, duration: 0.18, type: 'triangle', volume: 0.05, delay: 0.2 }
    ])
  }, [playTones])

  const playWallBumpSound = useCallback(() => {
    playTones([
      { frequency: 240, duration: 0.03, type: 'square', volume: 0.07 },
      { frequency: 180, duration: 0.09, type: 'triangle', volume: 0.05, delay: 0.015 }
    ])
  }, [playTones])

  const playThrustSound = useCallback(() => {
    playTones([
      { frequency: 360, duration: 0.045, type: 'sine', volume: 0.01 },
      { frequency: 510, duration: 0.04, type: 'triangle', volume: 0.007, delay: 0.012 }
    ])
  }, [playTones])

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

  useEffect(() => {
    setGameState(generateLevel(level, Date.now(), undefined, canvasSize.width, canvasSize.height))
    setIsPaused(false)
    hasSaved.current = false
    lastTimeRef.current = 0
    previousGameStateRef.current = {
      score: 0,
      status: 'playing',
      wallHit: false
    }
    boundaryContactRef.current = {
      left: false,
      right: false,
      top: false,
      bottom: false
    }
  }, [canvasSize.height, canvasSize.width, level])

  useEffect(() => {
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        void audioContextRef.current.close().catch(() => {})
      }
    }
  }, [])

  // Обработка джойстика
  const handleJoystickMove = useCallback((vector: { x: number, y: number }) => {
    setJoystickVector(vector)
  }, [])

  // Сброс игры
  const resetGame = useCallback(() => {
    setGameState(generateLevel(level, Date.now()))
    setIsPaused(false)
    hasSaved.current = false
    lastTimeRef.current = 0
    previousGameStateRef.current = {
      score: 0,
      status: 'playing',
      wallHit: false
    }
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
    }
  }, [gameState.status, user?.id])

  useEffect(() => {
    const previous = previousGameStateRef.current

    if (gameState.score > previous.score) {
      playSuccessSound()
    }

    if (gameState.status === 'won' && previous.status !== 'won') {
      playWinSound()
    } else if (gameState.status === 'lost' && previous.status !== 'lost') {
      playFailSound()
    }

    previousGameStateRef.current = {
      score: gameState.score,
      status: gameState.status,
      wallHit: gameState.wallHit
    }
  }, [gameState.score, gameState.status, gameState.wallHit, playFailSound, playSuccessSound, playWinSound])

  useEffect(() => {
    if (!gameState.wallHit) return

    const now = performance.now()
    if (now - lastWallSoundAtRef.current <= 120) return

    lastWallSoundAtRef.current = now
    playWallBumpSound()
  }, [gameState.wallHit, playWallBumpSound])

  useEffect(() => {
    if (gameState.status !== 'playing') return

    const halfWidth = canvasSize.width / 2 - 5
    const halfHeight = canvasSize.height / 2 - 5
    const touchesHorizontalWall =
      gameState.ship.x - SHIP_RADIUS <= -halfWidth + 1 ||
      gameState.ship.x + SHIP_RADIUS >= halfWidth - 1
    const touchesVerticalWall =
      gameState.ship.y - SHIP_RADIUS <= -halfHeight + 1 ||
      gameState.ship.y + SHIP_RADIUS >= halfHeight - 1

    if (!touchesHorizontalWall && !touchesVerticalWall) return

    const now = performance.now()
    if (now - lastWallSoundAtRef.current <= 120) return

    lastWallSoundAtRef.current = now
    playWallBumpSound()
  }, [
    canvasSize.height,
    canvasSize.width,
    gameState.ship.x,
    gameState.ship.y,
    gameState.status,
    playWallBumpSound,
  ])

  useEffect(() => {
    if (gameState.status !== 'playing') {
      boundaryContactRef.current = {
        left: false,
        right: false,
        top: false,
        bottom: false
      }
      return
    }

    const horizontalLimit = canvasSize.width / 2 - SHIP_RADIUS
    const verticalLimit = canvasSize.height / 2 - SHIP_RADIUS
    const horizontalTolerance = 4
    const verticalTolerance = isMobile ? 10 : 6
    const nextContacts = {
      left: gameState.ship.x <= -horizontalLimit + horizontalTolerance && gameState.ship.vx <= 0,
      right: gameState.ship.x >= horizontalLimit - horizontalTolerance && gameState.ship.vx >= 0,
      top: gameState.ship.y <= -verticalLimit + verticalTolerance && gameState.ship.vy <= 0,
      bottom: gameState.ship.y >= verticalLimit - verticalTolerance && gameState.ship.vy >= 0
    }

    const previousContacts = boundaryContactRef.current
    const hasNewContact =
      (nextContacts.left && !previousContacts.left) ||
      (nextContacts.right && !previousContacts.right) ||
      (nextContacts.top && !previousContacts.top) ||
      (nextContacts.bottom && !previousContacts.bottom)

    if (hasNewContact) {
      const now = performance.now()
      if (now - lastWallSoundAtRef.current > 120) {
        lastWallSoundAtRef.current = now
        playWallBumpSound()
      }
    }

    boundaryContactRef.current = nextContacts
  }, [
    canvasSize.height,
    canvasSize.width,
    gameState.ship.vx,
    gameState.ship.vy,
    gameState.ship.x,
    gameState.ship.y,
    isMobile,
    gameState.status,
    playWallBumpSound
  ])

  useEffect(() => {
    if (!gameState.ship.thrust || gameState.status !== 'playing') return

    const now = performance.now()
    if (now - lastThrustSoundAtRef.current < 90) return

    lastThrustSoundAtRef.current = now
    playThrustSound()
  }, [gameState.ship.thrust, gameState.status, playThrustSound])

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
        const canvas = canvasRef.current
        const halfWidth = canvas ? (canvas.width / 2) - 5 : 295  // Минимальный отступ от границ
        const halfHeight = canvas ? (canvas.height / 2) - 5 : 215 // Минимальный отступ от границ
        
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
        if (wallHit) {
          const now = performance.now()
          if (now - lastWallSoundAtRef.current > 120) {
            lastWallSoundAtRef.current = now
            playWallBumpSound()
          }
        }

        // Обновляем физику
        return updatePhysics(newState, deltaTime * 60, canvasSize.width, canvasSize.height) // Нормализуем deltaTime
      })

      animationRef.current = requestAnimationFrame(gameLoop)
    }

    animationRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPaused, gameState.status, joystickVector, gameState.asteroids.length, playWallBumpSound]) // Добавил joystickVector и gameState.asteroids.length

  // Рендеринг игры
  useEffect(() => {
    const canvasElement = canvasRef.current
    if (!canvasElement) return

    const ctx = canvasElement.getContext('2d')
    if (!ctx) return

    // Очистка canvas
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height)

    // Сохраняем состояние контекста
    ctx.save()

    // Перемещаем центр координат в центр canvas
    ctx.translate(canvasElement.width / 2, canvasElement.height / 2)

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
    ctx.lineWidth = 5
    ctx.setLineDash([5, 5]) // Пунктирная линия
    ctx.strokeRect(-canvasElement.width/2, -canvasElement.height/2, canvasElement.width, canvasElement.height)
    ctx.setLineDash([]) // Сбрасываем пунктир

    // Восстанавливаем состояние контекста
    ctx.restore()

  }, [gameState])

  // Обработчики
  const handleSelectLevel = () => {
    window.location.href = '/math/gravity-slingshot'
  }

  const handleMainMenu = () => {
    window.location.href = '/math'
  }

  const handlePlayAgain = () => {
    // Получаем следующий вариант и сбрасываем игру
    const nextVariant = getNextVariant(level) // Получаем следующий вариант планеты
    setGameState(generateLevel(level, Date.now(), nextVariant, canvasSize.width, canvasSize.height)) // Генерируем уровень с новым вариантом
    setIsPaused(false)
    hasSaved.current = false
    lastTimeRef.current = 0
    previousGameStateRef.current = {
      score: 0,
      status: 'playing',
      wallHit: false
    }
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
        className="mb-4 flex gap-2 justify-center"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg px-3 py-2 border-2 border-purple-200">
          <div className="flex items-center gap-1">
            <span className="text-lg">🎯</span>
            <span className="text-xs text-gray-600 font-medium">Рівень:</span>
            <span className="text-sm font-bold text-purple-600">{gameState.level}</span>
          </div>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg px-3 py-2 border-2 border-pink-200">
          <div className="flex items-center gap-1">
            <span className="text-lg">⭐</span>
            <span className="text-xs text-gray-600 font-medium">Зібрано:</span>
            <span className="text-sm font-bold text-pink-600">{gameState.score}/{gameState.level === 1 ? 1 : gameState.level === 2 ? 2 : 2}</span>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg px-3 py-2 border-2 border-blue-200">
          <div className="flex items-center gap-1">
            <span className="text-lg">🪐</span>
            <span className="text-xs text-gray-600 font-medium">Планета:</span>
            <span className="text-sm font-bold text-blue-600">{gameState.planetNumber}</span>
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
            width={canvasSize.width}
            height={canvasSize.height}
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
          <div className="relative flex w-[220px] items-center justify-center">
            <Joystick 
              onMove={handleJoystickMove}
              size={100}
              stickSize={32}
            />
            <button
              type="button"
              onClick={() => setSoundEnabled((current) => !current)}
              className={`absolute right-0 flex h-12 w-12 items-center justify-center rounded-2xl border-2 text-xl shadow-lg transition-all duration-200 ${
                soundEnabled
                  ? 'border-emerald-300 bg-white text-emerald-600 hover:bg-emerald-50'
                  : 'border-slate-300 bg-white text-slate-500 hover:bg-slate-50'
              }`}
              aria-label={soundEnabled ? 'Вимкнути звук' : 'Увімкнути звук'}
              title={soundEnabled ? 'Вимкнути звук' : 'Увімкнути звук'}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
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
            onPlayAgain={handlePlayAgain}
            onSelectLevel={handleSelectLevel}
            onMainMenu={handleMainMenu}
            title="Рівень пройдено!"
            winMessage="Чудово!"
            playAgainText="Спробувати ще"
            selectLevelText="Вибрати рівень"
            mainMenuText="На головну"
          />
        )}
        {gameState.status === 'lost' && (
          <GameEndModal
            isOpen={true}
            isWon={false}
            onPlayAgain={handlePlayAgain}
            onSelectLevel={handleSelectLevel}
            onMainMenu={handleMainMenu}
            title="Спробуйте ще раз!"
            loseMessage="Не вдалося"
            playAgainText="Спробувати ще"
            selectLevelText="Вибрати рівень"
            mainMenuText="На головну"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
