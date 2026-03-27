export interface BalanceScaleLevel {
  value: number
  label: string
  description: string
}

export interface BalanceWeight {
  id: string
  value: number
}

export interface BalanceRound {
  target: number
  availableWeights: BalanceWeight[]
  solutionIds: string[]
}

export const BALANCE_LEVELS: BalanceScaleLevel[] = [
  { value: 10, label: 'До 10', description: 'Легкі приклади на додавання' },
  { value: 20, label: 'До 20', description: 'Трохи більше чисел і варіантів' },
  { value: 50, label: 'До 50', description: 'Складніші комбінації гир' },
  { value: 100, label: 'До 100', description: 'Великі числа для уважних гравців' },
]

const shuffle = <T,>(items: T[]) => {
  const next = [...items]

  for (let index = next.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[randomIndex]] = [next[randomIndex], next[index]]
  }

  return next
}

const getPartsCount = (maxValue: number) => {
  if (maxValue <= 10) return 2
  if (maxValue <= 20) return Math.random() > 0.5 ? 2 : 3
  if (maxValue <= 50) return Math.random() > 0.4 ? 3 : 2
  return Math.random() > 0.5 ? 3 : 4
}

const createSolutionValues = (target: number, partsCount: number) => {
  const values: number[] = []
  let remaining = target

  for (let index = 0; index < partsCount - 1; index += 1) {
    const slotsLeft = partsCount - index - 1
    const minValue = 1
    const maxValue = remaining - slotsLeft
    const nextValue = Math.max(minValue, Math.floor(Math.random() * maxValue) + 1)

    values.push(nextValue)
    remaining -= nextValue
  }

  values.push(remaining)
  return shuffle(values)
}

const createDecoyValues = (target: number, maxValue: number, count: number, blockedValues: number[]) => {
  const decoys: number[] = []
  const used = new Set(blockedValues)

  while (decoys.length < count) {
    const nextValue = Math.max(1, Math.floor(Math.random() * Math.min(maxValue, target + Math.ceil(maxValue / 4))) + 1)

    if (used.has(nextValue)) continue

    used.add(nextValue)
    decoys.push(nextValue)
  }

  return decoys
}

export const generateBalanceRound = (maxValue: number): BalanceRound => {
  const minTarget = Math.max(4, Math.floor(maxValue * 0.4))
  const target = Math.floor(Math.random() * (maxValue - minTarget + 1)) + minTarget
  const partsCount = getPartsCount(maxValue)
  const solutionValues = createSolutionValues(target, partsCount)
  const decoyCount = maxValue <= 10 ? 2 : 3
  const decoyValues = createDecoyValues(target, maxValue, decoyCount, solutionValues)

  const weights = shuffle(
    [...solutionValues, ...decoyValues].map((value, index) => ({
      id: `weight-${index + 1}-${value}`,
      value,
    }))
  )

  const solutionIds = weights
    .filter((weight, index) => index < weights.length && solutionValues.includes(weight.value))
    .reduce<string[]>((acc, weight) => {
      if (acc.length === solutionValues.length) return acc

      const occurrencesInSolution = solutionValues.filter((value) => value === weight.value).length
      const occurrencesInAcc = acc
        .map((id) => weights.find((weightItem) => weightItem.id === id)?.value)
        .filter((value) => value === weight.value).length

      if (occurrencesInAcc < occurrencesInSolution) {
        acc.push(weight.id)
      }

      return acc
    }, [])

  return {
    target,
    availableWeights: weights,
    solutionIds,
  }
}
