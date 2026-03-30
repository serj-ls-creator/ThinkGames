// Базовые типы для игр
export interface WordPair {
  left: string
  right: string
}

export interface GameLevel {
  level: number
  pairs: WordPair[]
}

// Типы для пользовательского прогресса
export interface UserProgress {
  section: string
  game: string
  level: number
  score: number
  completedAt: string
}

// Типы для навигации и разделов
export interface Section {
  id: string
  title: string
  icon: string
  description: string
  color: string
  route: string
  progress: number
}

export interface GameCard {
  id: string
  title: string
  icon: string
  description?: string
  route: string
  color?: string
}

// Типы для игровых состояний
export interface Card {
  id: string
  content: string
  pairId: string
  isFlipped: boolean
  isMatched: boolean
  isMismatched: boolean
}

export interface GridSize {
  rows: number
  cols: number
}

export interface GameState {
  cards: Card[]
  selectedCards: string[]
  matchedPairs: number
  moves: number
  level: number
  gridSize: GridSize
  isChecking: boolean
  gameStarted: boolean
  gameCompleted: boolean
}

export interface GameActions {
  initializeGame: (level: number, gridSize?: GridSize) => void
  flipCard: (cardId: string) => void
  checkMatch: () => void
  resetGame: () => void
  setLevel: (level: number) => void
  setGridSize: (gridSize: GridSize) => void
  setGameCompleted: (completed: boolean) => void
}

// Типы для уровней сложности
export interface Level {
  value: number
  label: string
  description: string
}

export interface GridSizeOption {
  rows: number
  cols: number
  label: string
  description: string
}

// Типы для UI компонентов
export interface ProgressBarProps {
  current: number
  total: number
  color?: string
  height?: string
  showLabel?: boolean
}

export interface LevelSelectorProps {
  levels: Level[]
  gridSizes?: GridSizeOption[]
  colorTheme: 'purple' | 'orange' | 'green'
  onLevelSelect?: (level: number) => void
  onGridSizeSelect?: (gridSize: { rows: number; cols: number }) => void
}

// Типы для страниц
export interface PageHeaderProps {
  title: string
  showBack?: boolean
  backHref?: string
  backLabel?: string
  color?: 'purple' | 'orange' | 'blue'
}

export interface SectionCardProps {
  title: string
  icon: string
  description: string
  progress: number
  color: string
  href: string
  level?: number
  xp?: string
  games?: { name: string; href: string }[]
}

// Типы для данных
export interface DutchLevel extends GameLevel {}
export interface MathLevel extends GameLevel {}

// Типы для результатов игр
export interface GameResult {
  sessionId: string
  game: string
  section: string
  level: number
  score: number
  timeSeconds: number
  completedAt: string
}
