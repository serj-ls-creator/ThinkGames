export type BalloonDifficultyKey = 'easy' | 'medium' | 'hard'

export interface BalloonDifficulty {
  key: BalloonDifficultyKey
  label: string
  description: string
  rows: number
  cols: number
  mines: number
}

export interface BalloonCell {
  id: string
  row: number
  col: number
  hasMine: boolean
  isOpen: boolean
  isFlagged: boolean
  adjacentMines: number
}

export const BALLOON_DIFFICULTIES: BalloonDifficulty[] = [
  {
    key: 'easy',
    label: 'Легкий',
    description: '5 × 5, 5 небезпечних кульок',
    rows: 5,
    cols: 5,
    mines: 5,
  },
  {
    key: 'medium',
    label: 'Середній',
    description: '7 × 7, 10 небезпечних кульок',
    rows: 7,
    cols: 7,
    mines: 10,
  },
  {
    key: 'hard',
    label: 'Складний',
    description: '9 × 9, 16 небезпечних кульок',
    rows: 9,
    cols: 9,
    mines: 16,
  },
]

const getCellId = (row: number, col: number) => `${row}-${col}`

const getNeighbors = (row: number, col: number, rows: number, cols: number) => {
  const neighbors: Array<{ row: number; col: number }> = []

  for (let nextRow = row - 1; nextRow <= row + 1; nextRow += 1) {
    for (let nextCol = col - 1; nextCol <= col + 1; nextCol += 1) {
      if (nextRow === row && nextCol === col) continue
      if (nextRow < 0 || nextCol < 0 || nextRow >= rows || nextCol >= cols) continue
      neighbors.push({ row: nextRow, col: nextCol })
    }
  }

  return neighbors
}

export const getDifficultyByKey = (difficulty: string): BalloonDifficulty =>
  BALLOON_DIFFICULTIES.find((item) => item.key === difficulty) ?? BALLOON_DIFFICULTIES[0]

export const createBalloonBoard = (
  difficulty: BalloonDifficulty,
  safeCell: { row: number; col: number }
) => {
  const cells: BalloonCell[] = []

  for (let row = 0; row < difficulty.rows; row += 1) {
    for (let col = 0; col < difficulty.cols; col += 1) {
      cells.push({
        id: getCellId(row, col),
        row,
        col,
        hasMine: false,
        isOpen: false,
        isFlagged: false,
        adjacentMines: 0,
      })
    }
  }

  const protectedCells = new Set(
    [
      { row: safeCell.row, col: safeCell.col },
      ...getNeighbors(safeCell.row, safeCell.col, difficulty.rows, difficulty.cols),
    ].map(({ row, col }) => getCellId(row, col))
  )

  const availableIds = cells.filter((cell) => !protectedCells.has(cell.id)).map((cell) => cell.id)

  for (let index = availableIds.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[availableIds[index], availableIds[randomIndex]] = [availableIds[randomIndex], availableIds[index]]
  }

  availableIds.slice(0, difficulty.mines).forEach((cellId) => {
    const cell = cells.find((item) => item.id === cellId)
    if (cell) {
      cell.hasMine = true
    }
  })

  return cells.map((cell) => ({
    ...cell,
    adjacentMines: getNeighbors(cell.row, cell.col, difficulty.rows, difficulty.cols).filter(
      ({ row, col }) => {
        const neighbor = cells.find((item) => item.row === row && item.col === col)
        return neighbor?.hasMine
      }
    ).length,
  }))
}

export const openArea = (
  board: BalloonCell[],
  startCellId: string,
  difficulty: BalloonDifficulty
) => {
  const nextBoard = board.map((cell) => ({ ...cell }))
  const queue = [startCellId]
  const visited = new Set<string>()

  while (queue.length > 0) {
    const currentId = queue.shift()
    if (!currentId || visited.has(currentId)) continue
    visited.add(currentId)

    const cell = nextBoard.find((item) => item.id === currentId)
    if (!cell || cell.isFlagged || cell.isOpen) continue

    cell.isOpen = true

    if (cell.hasMine || cell.adjacentMines > 0) continue

    const neighbors = getNeighbors(cell.row, cell.col, difficulty.rows, difficulty.cols)
    neighbors.forEach(({ row, col }) => queue.push(getCellId(row, col)))
  }

  return nextBoard
}

export const revealAllMines = (board: BalloonCell[]) =>
  board.map((cell) =>
    cell.hasMine
      ? {
          ...cell,
          isOpen: true,
        }
      : cell
  )

export const hasWonBalloonSweeper = (board: BalloonCell[]) =>
  board.every((cell) => (cell.hasMine ? true : cell.isOpen))
