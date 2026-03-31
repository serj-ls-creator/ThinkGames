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
export const MAP_WIDTH = 600  // от -300 до +300
export const MAP_HEIGHT = 400 // от -200 до +200
export const BOUNDARY_FORCE = 50  // Уменьшено с 200 до 50
export const BOUNDARY_DAMPING = 0.8 // Увеличено с 0.7 до 0.8 (меньше затухания)
export const BOUNDARY_MARGIN = 30 // Зона мягкого отталкивания

import { getRandomLevelVariant, LevelVariant, GravityLevelData, GRAVITY_LEVELS_DATA } from '../data/gravityGameLevels'

export function applyBoundaryForces(obj: { x: number, y: number, vx: number, vy: number, radius: number }, deltaTime: number) {
  const halfWidth = MAP_WIDTH / 2  // 300
  const halfHeight = MAP_HEIGHT / 2 // 200
  
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

export function generateLevel(level: number): GameState {
  // Получаем детерминированный вариант из файла (чтобы избежать ошибок гидратации)
  const levelVariant = getRandomLevelVariant(level)
  
  // Ракета всегда в левом нижнем углу
  const ship: Ship = {
    x: -250, // Левый край (учитывая MAP_WIDTH = 600, от -300 до +300)
    y: 150,  // Нижний край (учитывая MAP_HEIGHT = 400, от -200 до +200)
    vx: 0,
    vy: 0,
    angle: 0,
    thrust: false
  }

  // Детерминированная случайная позиция на карте
const getDeterministicPosition = (index: number, level: number) => {
  // Используем индекс и уровень для создания "случайной" но детерминированной позиции
  const seed = level * 1000 + index * 100
  const angle = ((seed * 7) % 360) * Math.PI / 180 // Детерминированный угол
  const distance = 100 + ((seed * 13) % 150) // Детерминированное расстояние от центра
  
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance
  }
}

// Детерминированная случайная скорость
const getDeterministicVelocity = (index: number, level: number) => {
  const seed = level * 1000 + index * 100
  const speed = 0.3 + ((seed * 17) % 50) / 100 // Скорость от 0.3 до 0.8
  const angle = ((seed * 23) % 360) * Math.PI / 180
  
  return {
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed
  }
}

// Детерминированные цвета для астероидов (чтобы избежать Math.random())
const getDeterministicColor = (index: number) => {
    const colors = [
      '#10B981', '#059669', '#047857', '#065F46', '#064E3B', // зеленые
      '#EF4444', '#DC2626', '#B91C1C', '#991B1B', '#7F1D1D', // красные
      '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A', // синие
      '#F59E0B', '#D97706', '#B45309', '#92400E', '#78350F', // оранжевые
      '#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95', // фиолетовые
      '#EC4899', '#DB2777', '#BE185D', '#9F1239', '#831843', // розовые
      '#14B8A6', '#0D9488', '#0F766E', '#115E59', '#134E4A', // бирюзовые
      '#F97316', '#EA580C', '#C2410C', '#9A3412', '#7C2D12', // темно-оранжевые
      '#6366F1', '#4F46E5', '#4338CA', '#3730A3', '#312E81', // индиго
      '#84CC16', '#65A30D', '#4D7C0F', '#365314', '#1A2E05'  // лайм
    ]
    return colors[index % colors.length]
  }

  // Создаем правильные астероиды
  const correctAsteroids: Asteroid[] = []
  const correctCount = level === 1 ? 1 : level === 2 ? 2 : 2
  
  for (let i = 0; i < correctCount; i++) {
    const correctAnswer = levelVariant.correctAnswers[i % levelVariant.correctAnswers.length]
    const position = getDeterministicPosition(i, level)
    const velocity = getDeterministicVelocity(i, level)
    
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
      color: getDeterministicColor(i + level * 10) // Детерминированный цвет
    })
  }

  // Создаем неправильные астероиды
  const wrongAsteroids: Asteroid[] = []
  const wrongCount = level === 1 ? 2 : level === 2 ? 2 : 3
  
  for (let i = 0; i < wrongCount; i++) {
    const wrongAnswer = levelVariant.wrongAnswers[i % levelVariant.wrongAnswers.length]
    const position = getDeterministicPosition(i + 10, level) // +10 чтобы не пересекаться с правильными
    const velocity = getDeterministicVelocity(i + 10, level)
    
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
      color: getDeterministicColor(i + level * 20) // Детерминированный цвет
    })
  }

  // Объединяем все астероиды и перемешиваем (детерминированно)
  const allAsteroids = [...correctAsteroids, ...wrongAsteroids]
  
  // Детерминированное перемешивание (чтобы избежать Math.random())
  const shuffleSeed = level
  for (let i = allAsteroids.length - 1; i > 0; i--) {
    const j = (shuffleSeed + i) % (i + 1);
    [allAsteroids[i], allAsteroids[j]] = [allAsteroids[j], allAsteroids[i]]
  }

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

export function updatePhysics(gameState: GameState, deltaTime: number): GameState {
  const newState = { ...gameState }
  const { ship, asteroids } = newState
  
  // Определяем количество правильных астероидов для текущего уровня
  const correctAsteroidsNeeded = gameState.level === 1 ? 1 : gameState.level === 2 ? 2 : 2

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
  const halfWidth = MAP_WIDTH / 2  // 300
  const halfHeight = MAP_HEIGHT / 2 // 200
  
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
    
    asteroid.x += asteroid.vx * deltaTime
    asteroid.y += asteroid.vy * deltaTime
    
    // Применяем силы отталкивания от границ для астероида
    const asteroidBoundaryResult = applyBoundaryForces(asteroid, deltaTime)
    asteroid.x = asteroidBoundaryResult.x
    asteroid.y = asteroidBoundaryResult.y
    asteroid.vx = asteroidBoundaryResult.vx
    asteroid.vy = asteroidBoundaryResult.vy
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
      if (asteroid.isCorrect) {
        newState.score++
        // Проверяем победу
        if (newState.score >= correctAsteroidsNeeded) {
          newState.status = 'won'
        }
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
