interface Pair {
  question: string
  answer: string
}

export const generatePairs = (level: number, pairsCount: number = 6): Pair[] => {
  const allPairs = []
  
  // Генерируем все возможные пары от 2×2 до 10×10 (включая 6×2, 4×3 и т.д.)
  for (let i = 2; i <= 10; i++) {
    for (let j = 2; j <= 10; j++) {
      allPairs.push({ question: `${i} × ${j}`, answer: String(i * j) })
    }
  }

  // Перемешать
  allPairs.sort(() => Math.random() - 0.5)

  // Выбрать только с уникальными ответами
  const usedAnswers = new Set()
  const result = []
  for (const pair of allPairs) {
    if (!usedAnswers.has(pair.answer)) {
      usedAnswers.add(pair.answer)
      result.push(pair)
    }
    if (result.length === pairsCount) break
  }

  return result
}

export const calculateScore = (moves: number, level: number, gridSize: { rows: number; cols: number }): number => {
  const baseScore = 1000
  const movesPenalty = moves * 10
  const levelBonus = level * 10
  const gridSizeBonus = (gridSize.rows * gridSize.cols) * 5 // Больше очков за большие поля
  
  return Math.max(0, baseScore - movesPenalty + levelBonus + gridSizeBonus)
}
