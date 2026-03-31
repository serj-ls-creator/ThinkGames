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
}

export const GRAVITY_CONSTANT = 20
export const SHIP_THRUST = 0.15
export const SHIP_ROTATION_SPEED = 0.1
export const PLANET_RADIUS = 50
export const SHIP_RADIUS = 20
export const ASTEROID_RADIUS = 30
export const COLLISION_DISTANCE = 35

export const GRAVITY_LEVELS = [
  {
    level: 1,
    planetNumber: 8,
    asteroidCount: 6,
    correctAsteroids: 3,
    operations: ['+', '-'],
    maxNumber: 15
  },
  {
    level: 2,
    planetNumber: 24,
    asteroidCount: 10,
    correctAsteroids: 5,
    operations: ['+', '-', '*'],
    maxNumber: 30
  },
  {
    level: 3,
    planetNumber: 36,
    asteroidCount: 12,
    correctAsteroids: 5,
    operations: ['+', '-', '*', '/'],
    maxNumber: 50
  }
]

function generateMathExpression(target: number, operations: string[], maxNumber: number): { expression: string, result: number } {
  const operation = operations[Math.floor(Math.random() * operations.length)]
  let expression = ''
  let result = 0

  switch (operation) {
    case '+':
      const a1 = Math.floor(Math.random() * maxNumber) + 1
      const b1 = target - a1
      if (b1 > 0 && b1 <= maxNumber) {
        expression = `${a1}+${b1}`
        result = target
      } else {
        expression = `${a1}+${Math.floor(Math.random() * maxNumber) + 1}`
        result = a1 + parseInt(expression.split('+')[1])
      }
      break
    case '-':
      const a2 = Math.floor(Math.random() * maxNumber) + target
      const b2 = a2 - target
      expression = `${a2}-${b2}`
      result = target
      break
    case '*':
      if (target > 1) {
        const factors = []
        for (let i = 2; i <= Math.sqrt(target); i++) {
          if (target % i === 0) {
            factors.push(i)
          }
        }
        if (factors.length > 0) {
          const factor = factors[Math.floor(Math.random() * factors.length)]
          expression = `${factor}*${target / factor}`
          result = target
        } else {
          expression = `${target}*1`
          result = target
        }
      } else {
        expression = `${target}*1`
        result = target
      }
      break
    case '/':
      const multiplier = Math.floor(Math.random() * 5) + 2
      const dividend = target * multiplier
      expression = `${dividend}/${multiplier}`
      result = target
      break
  }

  return { expression, result }
}

function generateWrongExpression(target: number, operations: string[], maxNumber: number): { expression: string, result: number } {
  const operation = operations[Math.floor(Math.random() * operations.length)]
  let expression = ''
  let result = 0

  switch (operation) {
    case '+':
      const a1 = Math.floor(Math.random() * maxNumber) + 1
      const b1 = Math.floor(Math.random() * maxNumber) + 1
      expression = `${a1}+${b1}`
      result = a1 + b1
      break
    case '-':
      const a2 = Math.floor(Math.random() * maxNumber) + 1
      const b2 = Math.floor(Math.random() * maxNumber) + 1
      expression = `${a2}-${b2}`
      result = a2 - b2
      break
    case '*':
      const a3 = Math.floor(Math.random() * 15) + 1
      const b3 = Math.floor(Math.random() * 15) + 1
      expression = `${a3}*${b3}`
      result = a3 * b3
      break
    case '/':
      const divisor = Math.floor(Math.random() * 10) + 1
      const dividend = divisor * (Math.floor(Math.random() * 10) + 1)
      expression = `${dividend}/${divisor}`
      result = dividend / divisor
      break
  }

  // Убедимся, что результат не совпадает с целевым числом
  if (result === target) {
    return generateWrongExpression(target, operations, maxNumber)
  }

  return { expression, result }
}

export function generateLevel(level: number): GameState {
  const levelConfig = GRAVITY_LEVELS[Math.min(level - 1, GRAVITY_LEVELS.length - 1)]
  
  // Инициализация корабля в случайной позиции на краю экрана
  const angle = Math.random() * Math.PI * 2
  const distance = 250
  const ship: Ship = {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    vx: 0,
    vy: 0,
    angle: angle + Math.PI,
    thrust: false
  }

  // Генерация астероидов
  const asteroids: Asteroid[] = []
  const usedPositions = new Set<string>()
  
  // Генерируем правильные астероиды
  for (let i = 0; i < levelConfig.correctAsteroids; i++) {
    let x, y
    do {
      const asteroidAngle = Math.random() * Math.PI * 2
      const asteroidDistance = 100 + Math.random() * 150
      x = Math.cos(asteroidAngle) * asteroidDistance
      y = Math.sin(asteroidAngle) * asteroidDistance
    } while (usedPositions.has(`${Math.round(x/10)},${Math.round(y/10)}`))
    
    usedPositions.add(`${Math.round(x/10)},${Math.round(y/10)}`)
    
    const { expression, result } = generateMathExpression(levelConfig.planetNumber, levelConfig.operations, levelConfig.maxNumber)
    const asteroidAngle = Math.random() * Math.PI * 2
    const orbitalSpeed = Math.sqrt(GRAVITY_CONSTANT / (Math.sqrt(x * x + y * y))) * 0.2
    
    asteroids.push({
      id: `correct-${i}`,
      x,
      y,
      vx: -Math.sin(asteroidAngle) * orbitalSpeed,
      vy: Math.cos(asteroidAngle) * orbitalSpeed,
      expression,
      result,
      isCorrect: true,
      radius: ASTEROID_RADIUS
    })
  }

  // Генерируем неправильные астероиды
  for (let i = 0; i < levelConfig.asteroidCount - levelConfig.correctAsteroids; i++) {
    let x, y
    do {
      const asteroidAngle = Math.random() * Math.PI * 2
      const asteroidDistance = 100 + Math.random() * 150
      x = Math.cos(asteroidAngle) * asteroidDistance
      y = Math.sin(asteroidAngle) * asteroidDistance
    } while (usedPositions.has(`${Math.round(x/10)},${Math.round(y/10)}`))
    
    usedPositions.add(`${Math.round(x/10)},${Math.round(y/10)}`)
    
    const { expression, result } = generateWrongExpression(levelConfig.planetNumber, levelConfig.operations, levelConfig.maxNumber)
    const asteroidAngle = Math.random() * Math.PI * 2
    const orbitalSpeed = Math.sqrt(GRAVITY_CONSTANT / (Math.sqrt(x * x + y * y))) * 0.2
    
    asteroids.push({
      id: `wrong-${i}`,
      x,
      y,
      vx: -Math.sin(asteroidAngle) * orbitalSpeed,
      vy: Math.cos(asteroidAngle) * orbitalSpeed,
      expression,
      result,
      isCorrect: false,
      radius: ASTEROID_RADIUS
    })
  }

  return {
    ship,
    asteroids,
    planetNumber: levelConfig.planetNumber,
    score: 0,
    lives: 1,
    status: 'playing',
    level
  }
}

export function updatePhysics(gameState: GameState, deltaTime: number): GameState {
  const newState = { ...gameState }
  const { ship, asteroids } = newState
  
  // Находим конфигурацию текущего уровня
  const levelConfig = GRAVITY_LEVELS[Math.min(gameState.level - 1, GRAVITY_LEVELS.length - 1)]

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
        if (newState.score >= levelConfig.correctAsteroids) {
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
