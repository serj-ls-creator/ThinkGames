import { mathPairsData } from '../src/data/mathPairs'

export interface Pair {
  question: string
  answer: string
}

const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items]

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]]
  }

  return copy
}

export const generatePairs = (level: number, pairsCount: number = 6): Pair[] => {
  const availableAnswers = Object.keys(mathPairsData)
    .map(Number)
    .filter(answer => answer <= level)

  if (availableAnswers.length < pairsCount) {
    throw new Error(
      `Недостатньо унікальних відповідей для рівня ${level}. Потрібно ${pairsCount}, доступно ${availableAnswers.length}.`
    )
  }

  const selectedAnswers = shuffle(availableAnswers).slice(0, pairsCount)

  return selectedAnswers.map(answer => {
    const examples = mathPairsData[answer]
    const question = examples[Math.floor(Math.random() * examples.length)]

    return {
      question,
      answer: String(answer),
    }
  })
}

export const calculateScore = (moves: number, level: number, gridSize: { rows: number; cols: number }): number => {
  const baseScore = 1000
  const movesPenalty = moves * 10
  const levelBonus = level * 10
  const gridSizeBonus = gridSize.rows * gridSize.cols * 5

  return Math.max(0, baseScore - movesPenalty + levelBonus + gridSizeBonus)
}
