interface Pair {
  question: string
  answer: string
}

export const generatePairs = (level: number, pairsCount: number = 6): Pair[] => {
  const pairs: Pair[] = []
  const usedNumbers = new Set<string>()

  const getRange = (level: number) => {
    if (level <= 20) {
      return { min: 1, max: 10 }
    } else if (level <= 50) {
      return { min: 2, max: 12 }
    } else {
      return { min: 3, max: 15 }
    }
  }

  const { min, max } = getRange(level)

  while (pairs.length < pairsCount) {
    const a = Math.floor(Math.random() * (max - min + 1)) + min
    const b = Math.floor(Math.random() * (max - min + 1)) + min
    const result = a * b
    const pairKey = `${a}×${b}`

    // Исключаем умножения на 1
    if (!usedNumbers.has(pairKey) && result <= level && a !== 1 && b !== 1) {
      usedNumbers.add(pairKey)
      pairs.push({
        question: `${a} × ${b}`,
        answer: result.toString(),
      })
    }
  }

  return pairs
}

export const calculateScore = (moves: number, level: number, gridSize: { rows: number; cols: number }): number => {
  const baseScore = 1000
  const movesPenalty = moves * 10
  const levelBonus = level * 10
  const gridSizeBonus = (gridSize.rows * gridSize.cols) * 5 // Больше очков за большие поля
  
  return Math.max(0, baseScore - movesPenalty + levelBonus + gridSizeBonus)
}
