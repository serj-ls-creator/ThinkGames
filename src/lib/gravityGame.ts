export interface Asteroid {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  expression: string
  result: number
  isCorrect: boolean
  radius: number
  color: string
}

export interface Ship {
  x: number
  y: number
  vx: number
  vy: number
  angle: number
  thrust: boolean
}

export interface GameState {
  ship: Ship
  asteroids: Asteroid[]
  planetNumber: number
  score: number
  lives: number
  status: 'playing' | 'won' | 'lost'
  level: number
  wallHit: boolean
}

export const GRAVITY_CONSTANT = 20
export const SHIP_THRUST = 0.05  // Уменьшено с 0.15 до 0.05 (в 3 раза медленнее)
export const SHIP_ROTATION_SPEED = 0.1
export const PLANET_RADIUS = 50
export const SHIP_RADIUS = 20
export const ASTEROID_RADIUS = 30
export const COLLISION_DISTANCE = 35

// Границы карты и сила отталкивания (в координатах canvas)
export const MAP_WIDTH = 600  // от -300 до +300 (десктоп)
export const MAP_HEIGHT = 440 // от -220 до +220 (десктоп)
export const BOUNDARY_FORCE = 50  // Уменьшено с 200 до 50
export const BOUNDARY_DAMPING = 0.8 // Увеличено с 0.7 до 0.8 (меньше затухания)
export const BOUNDARY_MARGIN = 30 // Зона мягкого отталкивания

import { getRandomLevelVariant, LevelVariant, GravityLevelData, GRAVITY_LEVELS_DATA } from '../data/gravityGameLevels'

export function applyBoundaryForces(obj: { x: number, y: number, vx: number, vy: number, radius: number }, deltaTime: number) {
  const halfWidth = MAP_WIDTH / 2  // 300
  const halfHeight = MAP_HEIGHT / 2 // 220
  
  let newX = obj.x
  let newY = obj.y
  let newVx = obj.vx
  let newVy = obj.vy
  
  // Жесткие границы - отталкивание при столкновении с немедленным замедлением
  if (obj.x - obj.radius < -halfWidth) {
    newX = -halfWidth + obj.radius
    newVx = Math.abs(obj.vx) * 0.001 // Очень сильное замедление в 1000 раз
    newVy = newVy * 0.001
  }
  if (obj.x + obj.radius > halfWidth) {
    newX = halfWidth - obj.radius
    newVx = -Math.abs(obj.vx) * 0.001 // Очень сильное замедление в 1000 раз
    newVy = newVy * 0.001
  }
  if (obj.y - obj.radius < -halfHeight) {
    newY = -halfHeight + obj.radius
    newVy = Math.abs(obj.vy) * 0.001 // Очень сильное замедление в 1000 раз
    newVx = newVx * 0.001
  }
  if (obj.y + obj.radius > halfHeight) {
    newY = halfHeight - obj.radius
    newVy = -Math.abs(obj.vy) * 0.001 // Очень сильное замедление в 1000 раз
    newVx = newVx * 0.001
  }
  
  // Мягкое отталкивание когда объект близко к границе
  let fx = 0, fy = 0
  
  if (obj.x < -halfWidth + BOUNDARY_MARGIN) {
    const distance = (obj.x + halfWidth) / BOUNDARY_MARGIN
    fx = BOUNDARY_FORCE * (1 - distance) * (1 - distance)
  }
  if (obj.x > halfWidth - BOUNDARY_MARGIN) {
    const distance = (halfWidth - obj.x) / BOUNDARY_MARGIN
    fx = -BOUNDARY_FORCE * (1 - distance) * (1 - distance)
  }
  if (obj.y < -halfHeight + BOUNDARY_MARGIN) {
    const distance = (obj.y + halfHeight) / BOUNDARY_MARGIN
    fy = BOUNDARY_FORCE * (1 - distance) * (1 - distance)
  }
  if (obj.y > halfHeight - BOUNDARY_MARGIN) {
    const distance = (halfHeight - obj.y) / BOUNDARY_MARGIN
    fy = -BOUNDARY_FORCE * (1 - distance) * (1 - distance)
  }
  
  newVx += fx * deltaTime
  newVy += fy * deltaTime
  
  return { x: newX, y: newY, vx: newVx, vy: newVy }
}

export function generateLevel(level: number, randomSeed?: number, variant?: LevelVariant, canvasWidth?: number, canvasHeight?: number): GameState {
  // Получаем детерминированный вариант из файла (чтобы избежать ошибок гидратации)
  const levelVariant = variant || getRandomLevelVariant(level)
  
  // Если seed не передан, используем текущее время для случайности
  const seed = randomSeed || Date.now()
  
  // Используем переданные размеры canvas или стандартные
  const mapWidth = canvasWidth || MAP_WIDTH
  const mapHeight = canvasHeight || MAP_HEIGHT
  
  // Ракета всегда в левом нижнем углу
  const ship: Ship = {
    x: -250, // Левый край (учитывая MAP_WIDTH = 600, от -300 до +300)
    y: 190,  // Нижний край (учитывая MAP_HEIGHT = 440, от -220 до +220)
    vx: 0,
    vy: 0,
    angle: 0,
    thrust: false
  }

  // Случайная позиция на карте с использованием seed
  const getRandomPosition = (index: number, useSeed: number) => {
    // Используем seed для создания случайной позиции
    const positionSeed = useSeed + index * 1000
    const angle = ((positionSeed * 7) % 360) * Math.PI / 180 // Случайный угол
    
    // Адаптивный разброс в зависимости от размеров поля
    const maxDistance = Math.min(mapWidth, mapHeight) * 0.4 // 40% от меньшего размера
    const distance = maxDistance * 0.6 + ((positionSeed * 13) % (maxDistance * 0.4)) // 60%-100% от maxDistance
    
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    }
  }

  // Случайная скорость с использованием seed
  const getRandomVelocity = (index: number, useSeed: number) => {
    const velocitySeed = useSeed + index * 1000
    const speed = 0.3 + ((velocitySeed * 17) % 50) / 100 // Скорость от 0.3 до 0.8
    const angle = ((velocitySeed * 23) % 360) * Math.PI / 180 // Случайное направление
    
    return {
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed
    }
  }

// Последовательные цвета для астероидов (по порядку)
const getSequentialColor = (asteroidIndex: number) => {
  const colors = [
    '#8B5CF6', // 1. Фиолетовый
    '#EF4444', // 2. Красный  
    '#10B981', // 3. Зеленый
    '#F59E0B', // 4. Оранжевый
    '#1F2937'  // 5. Черный
  ]
  return colors[asteroidIndex % colors.length]
}

  // Создаем правильные астероиды
  const correctAsteroids: Asteroid[] = []
  const correctCount = level === 1 ? 1 : level === 2 ? 2 : 2
  
  // Берем только нужное количество правильных ответов без дубликатов
  const uniqueCorrectAnswers = levelVariant.correctAnswers.slice(0, correctCount)
  
  for (let i = 0; i < correctCount; i++) {
    const correctAnswer = uniqueCorrectAnswers[i]
    const position = getRandomPosition(i, seed)
    const velocity = getRandomVelocity(i, seed)
    
    correctAsteroids.push({
      id: `correct-${i}`,
      x: position.x,
      y: position.y,
      vx: velocity.vx,
      vy: velocity.vy,
      expression: correctAnswer.expression,
      result: correctAnswer.result,
      isCorrect: true,
      radius: ASTEROID_RADIUS,
      color: getSequentialColor(i) // 0: фиолетовый, 1: красный, 2: зеленый
    })
  }

  // Создаем неправильные астероиды
  const wrongAsteroids: Asteroid[] = []
  const wrongCount = level === 1 ? 2 : level === 2 ? 2 : 3
  
  // Берем только нужное количество неправильных ответов без дубликатов
  const uniqueWrongAnswers = levelVariant.wrongAnswers.slice(0, wrongCount)
  
  for (let i = 0; i < wrongCount; i++) {
    const wrongAnswer = uniqueWrongAnswers[i]
    const position = getRandomPosition(i + 20, seed) // +20 чтобы не пересекаться с правильными
    const velocity = getRandomVelocity(i + 10, seed)
    
    wrongAsteroids.push({
      id: `wrong-${i}`,
      x: position.x,
      y: position.y,
      vx: velocity.vx,
      vy: velocity.vy,
      expression: wrongAnswer.expression,
      result: wrongAnswer.result,
      isCorrect: false,
      radius: ASTEROID_RADIUS,
      color: getSequentialColor(i + correctCount) // Продолжение последовательности после правильных
    })
  }

  // Объединяем все астероиды и перемешиваем (детерминированно)
  const allAsteroids = [...correctAsteroids, ...wrongAsteroids]
  
  // Детерминированное перемешивание (чтобы избежать Math.random())
  const shuffleSeed = level
  const shuffled = allAsteroids.sort((a, b) => {
    const hashA = (shuffleSeed + a.id.charCodeAt(0)) % 100
    const hashB = (shuffleSeed + b.id.charCodeAt(0)) % 100
    return hashA - hashB
  })

  return {
    ship,
    asteroids: allAsteroids,
    planetNumber: levelVariant.planetNumber,
    score: 0,
    lives: 1,
    status: 'playing',
    level: level,
    wallHit: false
  }
}

export function updatePhysics(gameState: GameState, deltaTime: number, canvasWidth?: number, canvasHeight?: number): GameState {
  const newState = { ...gameState }
  const { ship, asteroids } = newState
  
  // Определяем количество правильных астероидов для текущего уровня
  const correctAsteroidsNeeded = gameState.level === 1 ? 1 : gameState.level === 2 ? 2 : 2
  
  // Получаем правильные ответы из данных уровня по planetNumber
  const levelData = GRAVITY_LEVELS_DATA.find(data => data.level === gameState.level)
  const currentVariant = levelData?.variants.find(v => v.planetNumber === gameState.planetNumber)
  const correctAnswers = currentVariant?.correctAnswers || []

  // Применяем гравитацию к кораблю
  const distanceToCenter = Math.sqrt(ship.x * ship.x + ship.y * ship.y)
  if (distanceToCenter > PLANET_RADIUS) {
    const gravityForce = GRAVITY_CONSTANT / (distanceToCenter * distanceToCenter)
    const ax = -(ship.x / distanceToCenter) * gravityForce
    const ay = -(ship.y / distanceToCenter) * gravityForce
    
    ship.vx += ax * deltaTime
    ship.vy += ay * deltaTime
  }

  // Применяем тягу корабля
  if (ship.thrust) {
    ship.vx += Math.cos(ship.angle) * SHIP_THRUST * deltaTime
    ship.vy += Math.sin(ship.angle) * SHIP_THRUST * deltaTime
  }

  // Обновляем позицию корабля
  ship.x += ship.vx * deltaTime
  ship.y += ship.vy * deltaTime

  // ПРЯМОЕ ЗАМЕДЛЕНИЕ ПРИ СТОЛКНОВЕНИИ СО СТЕНАМИ
  const mapWidth = canvasWidth || MAP_WIDTH
  const mapHeight = canvasHeight || MAP_HEIGHT
  const halfWidth = mapWidth / 2  
  const halfHeight = mapHeight / 2
  
  let wallHit = false
  
  if (ship.x - SHIP_RADIUS < -halfWidth) {
    ship.x = -halfWidth + SHIP_RADIUS
    ship.vx = Math.abs(ship.vx) * 0.001 // 1000x замедление
    ship.vy *= 0.001
    wallHit = true
  }
  if (ship.x + SHIP_RADIUS > halfWidth) {
    ship.x = halfWidth - SHIP_RADIUS
    ship.vx = -Math.abs(ship.vx) * 0.001 // 1000x замедление
    ship.vy *= 0.001
    wallHit = true
  }
  if (ship.y - SHIP_RADIUS < -halfHeight) {
    ship.y = -halfHeight + SHIP_RADIUS
    ship.vy = Math.abs(ship.vy) * 0.001 // 1000x замедление
    ship.vx *= 0.001
    wallHit = true
  }
  if (ship.y + SHIP_RADIUS > halfHeight) {
    ship.y = halfHeight - SHIP_RADIUS
    ship.vy = -Math.abs(ship.vy) * 0.001 // 1000x замедление
    ship.vx *= 0.001
    wallHit = true
  }

  // Обновляем wallHit в состоянии
  newState.wallHit = wallHit

  // Применяем силы отталкивания от границ для корабля
  const shipBoundaryResult = applyBoundaryForces({
    x: ship.x,
    y: ship.y,
    vx: ship.vx,
    vy: ship.vy,
    radius: SHIP_RADIUS
  }, deltaTime)
  
  ship.x = shipBoundaryResult.x
  ship.y = shipBoundaryResult.y
  ship.vx = shipBoundaryResult.vx
  ship.vy = shipBoundaryResult.vy

  // Обновляем астероиды (орбитальное движение)
  asteroids.forEach(asteroid => {
    const distanceToCenter = Math.sqrt(asteroid.x * asteroid.x + asteroid.y * asteroid.y)
    if (distanceToCenter > PLANET_RADIUS) {
      const gravityForce = GRAVITY_CONSTANT / (distanceToCenter * distanceToCenter)
      const ax = -(asteroid.x / distanceToCenter) * gravityForce
      const ay = -(asteroid.y / distanceToCenter) * gravityForce
      
      asteroid.vx += ax * deltaTime
      asteroid.vy += ay * deltaTime
    }
    
    // ДВИЖЕНИЕ АСТЕРОИДОВ
    asteroid.x += asteroid.vx * deltaTime
    asteroid.y += asteroid.vy * deltaTime
    
    // Применяем силы отталкивания от границ для астероида (адаптивные размеры)
    if (asteroid.x - ASTEROID_RADIUS < -halfWidth) {
      asteroid.x = -halfWidth + ASTEROID_RADIUS
      asteroid.vx = Math.abs(asteroid.vx) * 0.001
      asteroid.vy *= 0.001
    }
    if (asteroid.x + ASTEROID_RADIUS > halfWidth) {
      asteroid.x = halfWidth - ASTEROID_RADIUS
      asteroid.vx = -Math.abs(asteroid.vx) * 0.001
      asteroid.vy *= 0.001
    }
    if (asteroid.y - ASTEROID_RADIUS < -halfHeight) {
      asteroid.y = -halfHeight + ASTEROID_RADIUS
      asteroid.vy = Math.abs(asteroid.vy) * 0.001
      asteroid.vx *= 0.001
    }
    if (asteroid.y + ASTEROID_RADIUS > halfHeight) {
      asteroid.y = halfHeight - ASTEROID_RADIUS
      asteroid.vy = -Math.abs(asteroid.vy) * 0.001
      asteroid.vx *= 0.001
    }
  })

  // Проверяем столкновения
  // Столкновение с планетой
  if (distanceToCenter < PLANET_RADIUS + SHIP_RADIUS) {
    newState.status = 'lost'
    return newState
  }

  // Столкновения с астероидами
  const remainingAsteroids = asteroids.filter(asteroid => {
    const dx = ship.x - asteroid.x
    const dy = ship.y - asteroid.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance < COLLISION_DISTANCE) {
      // Проверяем правильный ли ответ на астероиде
      const isCorrectAnswer = correctAnswers.some(answer => answer.result === asteroid.result)
      
      if (isCorrectAnswer) {
        newState.score++
        // Проверяем победу
        if (newState.score >= correctAsteroidsNeeded) {
          newState.status = 'won'
        }
        // Не прерываем цикл, а помечаем астероид для удаления
        return false // Удаляем правильный астероид
      } else {
        newState.status = 'lost'
        return true // Сохраняем неправильный астероид
      }
    }
    return true // Сохраняем астероид
  })

  newState.asteroids = remainingAsteroids

  return newState
}
