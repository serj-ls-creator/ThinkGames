export const POINTS_STORAGE_KEY = 'thinkgames-total-points'
export const POINTS_GOAL = 500

export function getStoredPoints(): number {
  if (typeof window === 'undefined') return 0

  const rawValue = localStorage.getItem(POINTS_STORAGE_KEY)
  const parsedValue = Number(rawValue)

  return Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : 0
}

export function setStoredPoints(points: number): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(POINTS_STORAGE_KEY, String(Math.max(0, Math.floor(points))))
}

export function addPoints(pointsToAdd: number): number {
  const nextPoints = getStoredPoints() + Math.max(0, Math.floor(pointsToAdd))
  setStoredPoints(nextPoints)
  return nextPoints
}
