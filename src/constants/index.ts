import { Section, GameCard, Level, GridSizeOption } from '../types'

// Разделы приложения
export const SECTIONS: Section[] = [
  {
    id: 'math',
    title: 'Математика',
    icon: '🧮',
    description: 'Вивчай числа та розв\'язуй задачі',
    color: 'from-purple-500 to-purple-600',
    route: '/math',
    progress: 75
  },
  {
    id: 'dutch',
    title: 'Нідерландська',
    icon: '/flags/netherlands.svg',
    description: 'Вивчай нові слова та фрази',
    color: 'from-orange-500 to-orange-600',
    route: '/dutch',
    progress: 30
  },
  {
    id: 'ukrainian',
    title: 'Українська',
    icon: '/flags/ukraine.svg',
    description: 'Покращуй свою мову',
    color: 'from-blue-500 to-blue-600',
    route: '/ukrainian',
    progress: 50
  }
]

// Игры для каждого раздела
export const MATH_GAMES: GameCard[] = [
  {
    id: 'find-pair',
    title: 'Знайди пару',
    icon: '🃏',
    route: '/math/find-pair',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'connect-pair',
    title: "З'єднай пару",
    icon: '🔗',
    route: '/math/connect-pair',
    color: 'from-purple-500 to-indigo-500'
  }
]

export const DUTCH_GAMES: GameCard[] = [
  {
    id: 'words',
    title: 'Слова',
    icon: '📖',
    route: '/dutch/words',
    color: 'from-orange-500 to-amber-500'
  },
  {
    id: 'connect-words',
    title: "З'єднай слова",
    icon: '🔗',
    route: '/dutch/connect-words',
    color: 'from-orange-500 to-amber-500'
  },
  {
    id: 'write-word',
    title: 'Напиши слово',
    icon: '✏️',
    route: '/dutch/write-word',
    color: 'from-orange-500 to-amber-500'
  }
]

export const UKRAINIAN_GAMES: GameCard[] = [] // Пока нет игр

// Маршруты приложения
export const ROUTES = {
  HOME: '/',
  PROFILE: '/profile',
  MATH: {
    INDEX: '/math',
    FIND_PAIR: {
      INDEX: '/math/find-pair',
      PLAY: '/math/find-pair/[level]'
    },
    CONNECT_PAIR: {
      INDEX: '/math/connect-pair',
      PLAY: '/math/connect-pair/[level]'
    }
  },
  DUTCH: {
    INDEX: '/dutch',
    WORDS: {
      INDEX: '/dutch/words',
      PLAY: '/dutch/words/[level]'
    },
    CONNECT_WORDS: {
      INDEX: '/dutch/connect-words',
      PLAY: '/dutch/connect-words/[level]'
    },
    WRITE_WORD: {
      INDEX: '/dutch/write-word',
      PLAY: '/dutch/write-word/[level]'
    }
  },
  UKRAINIAN: '/ukrainian'
} as const

// Уровни сложности
export const MATH_LEVELS: Level[] = [
  { value: 20, label: 'До 20', description: 'Легкий рівень' },
  { value: 50, label: 'До 50', description: 'Середній рівень' },
  { value: 100, label: 'До 100', description: 'Складний рівень' },
]

export const MATH_CONNECT_LEVELS: Level[] = [
  { value: 1, label: 'Таблиця на 2', description: 'Легкий рівень' },
  { value: 2, label: 'Таблиця на 3', description: 'Середній рівень' },
  { value: 3, label: 'Таблиця на 4', description: 'Середній рівень' },
  { value: 4, label: 'Таблиця на 5', description: 'Середній рівень' },
  { value: 5, label: 'Таблиця на 6', description: 'Середній рівень' },
  { value: 6, label: 'Таблиця на 7', description: 'Складний рівень' },
  { value: 7, label: 'Таблиця на 8', description: 'Складний рівень' },
  { value: 8, label: 'Таблиця на 9', description: 'Складний рівень' },
  { value: 9, label: 'Таблиця на 10', description: 'Складний рівень' },
  { value: 10, label: 'Змішані', description: 'Дуже складний рівень' },
]

export const DUTCH_LEVELS: Level[] = [
  { value: 1, label: 'Рівень 1', description: 'Базові слова' },
  { value: 2, label: 'Рівень 2', description: 'Школа та навчання' },
  { value: 3, label: 'Рівень 3', description: 'Сім\'я та люди' },
  { value: 4, label: 'Рівень 4', description: 'Тварини' },
  { value: 5, label: 'Рівень 5', description: 'Кольори' },
  { value: 6, label: 'Рівень 6', description: 'Числа' },
  { value: 7, label: 'Рівень 7', description: 'Їжа та напої' },
  { value: 8, label: 'Рівень 8', description: 'Одяг' },
  { value: 9, label: 'Рівень 9', description: 'Погода' },
  { value: 10, label: 'Рівень 10', description: 'Час та дата' },
]

// Размеры сетки
export const GRID_SIZES: GridSizeOption[] = [
  { rows: 3, cols: 4, label: '3×4', description: '12 карток' },
  { rows: 4, cols: 4, label: '4×4', description: '16 карток' },
  { rows: 3, cols: 6, label: '3×6', description: '18 карток' },
]

// Количество уровней
export const LEVELS_COUNT = {
  MATH: 3,
  MATH_CONNECT: 10,
  DUTCH: 10,
  UKRAINIAN: 0
} as const

// Цветовые темы
export const COLOR_THEMES = {
  purple: {
    selected: 'border-purple-500 bg-purple-50 text-purple-700',
    default: 'border-gray-200 bg-white text-gray-700 hover:border-purple-300',
    bg: 'from-purple-100 to-purple-200',
    text: 'text-purple-800',
    hover: 'hover:from-purple-200 hover:to-purple-300',
    iconBg: 'bg-purple-500'
  },
  orange: {
    selected: 'border-orange-500 bg-orange-50 text-orange-700',
    default: 'border-gray-200 bg-white text-gray-700 hover:border-orange-300',
    bg: 'from-orange-100 to-orange-200',
    text: 'text-orange-800',
    hover: 'hover:from-orange-200 hover:to-orange-300',
    iconBg: 'bg-orange-500'
  },
  green: {
    selected: 'border-green-500 bg-green-50 text-green-700',
    default: 'border-gray-200 bg-white text-gray-700 hover:border-green-300',
    bg: 'from-green-100 to-green-200',
    text: 'text-green-800',
    hover: 'hover:from-green-200 hover:to-green-300',
    iconBg: 'bg-green-500'
  },
  blue: {
    selected: 'border-blue-500 bg-blue-50 text-blue-700',
    default: 'border-gray-200 bg-white text-gray-700 hover:border-blue-300',
    bg: 'from-blue-100 to-blue-200',
    text: 'text-blue-800',
    hover: 'hover:from-blue-200 hover:to-blue-300',
    iconBg: 'bg-blue-500'
  }
} as const

// Навигационные элементы
export const NAV_ITEMS = [
  { id: 'home', label: 'Головна', icon: '🏠', href: ROUTES.HOME },
  { id: 'games', label: 'Ігри', icon: '🎮', href: ROUTES.MATH.INDEX },
  { id: 'progress', label: 'Прогрес', icon: '📊', href: ROUTES.HOME },
  { id: 'settings', label: 'Профіль', icon: '👤', href: ROUTES.PROFILE },
] as const
