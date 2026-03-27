interface Pair {
  question: string
  answer: string
}

export const generatePairs = (level: number, pairsCount: number = 6): Pair[] => {
  const allPairs = []
  const usedAnswers = new Set()
  
  // Генерируем все возможные пары от 2×2 до 10×10, но исключаем дубликаты ответов
  for (let i = 2; i <= 10; i++) {
    for (let j = 2; j <= 10; j++) {
      const answer = String(i * j)
      
      // Проверяем, не использован ли уже этот ответ
      if (!usedAnswers.has(answer)) {
        allPairs.push({ question: `${i} × ${j}`, answer })
        usedAnswers.add(answer)
      }
    }
  }

  // Перемешать
  allPairs.sort(() => Math.random() - 0.5)

  // Выбрать нужное количество пар
  return allPairs.slice(0, pairsCount)
}

export const calculateScore = (moves: number, level: number, gridSize: { rows: number; cols: number }): number => {
  const baseScore = 1000
  const movesPenalty = moves * 10
  const levelBonus = level * 10
  const gridSizeBonus = (gridSize.rows * gridSize.cols) * 5 // Больше очков за большие поля
  
  return Math.max(0, baseScore - movesPenalty + levelBonus + gridSizeBonus)
}
