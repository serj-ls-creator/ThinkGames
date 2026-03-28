// Хранилище XP и уровней
export const XP_STORAGE_KEYS = {
  UKRAINIAN: 'thinkgames-ukrainian-xp',
  DUTCH: 'thinkgames-dutch-xp',
  MATH: 'thinkgames-math-xp'
} as const

export const XP_PER_LEVEL = 500

export interface XPData {
  ukrainian_xp: number
  dutch_xp: number
  math_xp: number
}

export interface LevelInfo {
  level: number
  progressInLevel: number
  xpToNextLevel: number
  progressPercentage: number
}

// Получение XP для конкретной категории
export function getStoredXP(category: keyof typeof XP_STORAGE_KEYS): number {
  if (typeof window === 'undefined') return 0

  const rawValue = localStorage.getItem(XP_STORAGE_KEYS[category])
  const parsedValue = Number(rawValue)

  return Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : 0
}

// Установка XP для конкретной категории
export function setStoredXP(category: keyof typeof XP_STORAGE_KEYS, xp: number): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(XP_STORAGE_KEYS[category], String(Math.max(0, Math.floor(xp))))
}

// Получение всех данных XP
export function getAllXP(): XPData {
  return {
    ukrainian_xp: getStoredXP('UKRAINIAN'),
    dutch_xp: getStoredXP('DUTCH'),
    math_xp: getStoredXP('MATH')
  }
}

// Универсальная функция добавления XP
export function addXP(category: keyof typeof XP_STORAGE_KEYS, amount: number): number {
  const currentXP = getStoredXP(category)
  const nextXP = currentXP + Math.max(0, Math.floor(amount))
  setStoredXP(category, nextXP)
  return nextXP
}

// Получение информации об уровне
export function getLevelInfo(xp: number): LevelInfo {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1
  const progressInLevel = xp % XP_PER_LEVEL
  const progressPercentage = (progressInLevel / XP_PER_LEVEL) * 100
  
  return {
    level,
    progressInLevel,
    xpToNextLevel: XP_PER_LEVEL,
    progressPercentage
  }
}

// Получение глобального уровня (сумма всех XP)
export function getGlobalLevel(): LevelInfo {
  const allXP = getAllXP()
  const totalXP = allXP.ukrainian_xp + allXP.dutch_xp + allXP.math_xp
  return getLevelInfo(totalXP)
}

// Миграция старых очков в новую систему
export function migrateOldPoints(): void {
  if (typeof window === 'undefined') return
  
  const oldPoints = localStorage.getItem('thinkgames-total-points')
  if (oldPoints) {
    const points = Number(oldPoints)
    if (Number.isFinite(points) && points > 0) {
      // Распределяем старые очки поровну между категориями
      const pointsPerCategory = Math.floor(points / 3)
      
      setStoredXP('MATH', pointsPerCategory)
      setStoredXP('DUTCH', pointsPerCategory)
      setStoredXP('UKRAINIAN', pointsPerCategory)
      
      // Удаляем старые очки
      localStorage.removeItem('thinkgames-total-points')
    }
  }
}

// Бонус за чистую игру
export function addCleanGameBonus(category: keyof typeof XP_STORAGE_KEYS): number {
  return addXP(category, 10) // +10 XP бонус
}

// Базовое действие
export function addActionXP(category: keyof typeof XP_STORAGE_KEYS): number {
  return addXP(category, 1) // +1 XP за действие
}
