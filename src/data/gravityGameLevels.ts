// Варианты чисел планеты и решений астероидов для игры "Орбітальна Арифметика"

export interface LevelVariant {
  planetNumber: number
  correctAnswers: {
    expression: string
    result: number
  }[]
  wrongAnswers: {
    expression: string
    result: number
  }[]
}

export interface GravityLevelData {
  level: number
  variants: LevelVariant[]
}

export const GRAVITY_LEVELS_DATA: GravityLevelData[] = [
  {
    level: 1,
    variants: [
      {
        planetNumber: 5,
        correctAnswers: [
          { expression: "2+3", result: 5 },
          { expression: "9-4", result: 5 },
          { expression: "1+4", result: 5 }
        ],
        wrongAnswers: [
          { expression: "2+2", result: 4 },
          { expression: "7-1", result: 6 },
          { expression: "8-2", result: 6 },
          { expression: "0+4", result: 4 }
        ]
      },
      {
        planetNumber: 6,
        correctAnswers: [
          { expression: "4+2", result: 6 },
          { expression: "8-2", result: 6 },
          { expression: "1+5", result: 6 },
          { expression: "9-3", result: 6 }
        ],
        wrongAnswers: [
          { expression: "2+3", result: 5 },
          { expression: "4+4", result: 8 },
          { expression: "7-2", result: 5 },
          { expression: "10-3", result: 7 }
        ]
      },
      {
        planetNumber: 7,
        correctAnswers: [
          { expression: "3+4", result: 7 },
          { expression: "9-2", result: 7 },
          { expression: "2+5", result: 7 },
          { expression: "10-3", result: 7 }
        ],
        wrongAnswers: [
          { expression: "3+3", result: 6 },
          { expression: "4+4", result: 8 },
          { expression: "8-2", result: 6 },
          { expression: "11-3", result: 8 }
        ]
      },
      {
        planetNumber: 8,
        correctAnswers: [
          { expression: "4+4", result: 8 },
          { expression: "10-2", result: 8 },
          { expression: "3+5", result: 8 },
          { expression: "11-3", result: 8 }
        ],
        wrongAnswers: [
          { expression: "3+4", result: 7 },
          { expression: "5+5", result: 10 },
          { expression: "9-2", result: 7 },
          { expression: "12-3", result: 9 }
        ]
      },
      {
        planetNumber: 9,
        correctAnswers: [
          { expression: "4+5", result: 9 },
          { expression: "11-2", result: 9 },
          { expression: "3+6", result: 9 },
          { expression: "12-3", result: 9 }
        ],
        wrongAnswers: [
          { expression: "4+4", result: 8 },
          { expression: "5+5", result: 10 },
          { expression: "10-2", result: 8 },
          { expression: "13-3", result: 10 }
        ]
      },
      {
        planetNumber: 10,
        correctAnswers: [
          { expression: "5+5", result: 10 },
          { expression: "12-2", result: 10 },
          { expression: "4+6", result: 10 },
          { expression: "13-3", result: 10 }
        ],
        wrongAnswers: [
          { expression: "4+5", result: 9 },
          { expression: "6x6", result: 12 },
          { expression: "11-2", result: 9 },
          { expression: "14-3", result: 11 }
        ]
      }
    ]
  },
  {
    level: 2,
    variants: [
      {
        planetNumber: 6,
        correctAnswers: [
          { expression: "2+4", result: 6 },
          { expression: "3x2", result: 6 },
          { expression: "8-2", result: 6 },
          { expression: "9-3", result: 6 }
        ],
        wrongAnswers: [
          { expression: "2+3", result: 5 },
          { expression: "4x4", result: 16 },
          { expression: "7-2", result: 5 },
          { expression: "3+5", result: 8 }
        ]
      },
      {
        planetNumber: 7,
        correctAnswers: [
          { expression: "2+5", result: 7 },
          { expression: "1x7", result: 7 },
          { expression: "10-3", result: 7 },
          { expression: "9-2", result: 7 }
        ],
        wrongAnswers: [
          { expression: "2+3", result: 5 },
          { expression: "4x2", result: 8 },
          { expression: "12-2", result: 10 },
          { expression: "19-8", result: 11 }
        ]
      },
      {
        planetNumber: 8,
        correctAnswers: [
          { expression: "4+4", result: 8 },
          { expression: "2x4", result: 8 },
          { expression: "10-2", result: 8 },
          { expression: "11-3", result: 8 }
        ],
        wrongAnswers: [
          { expression: "3+4", result: 7 },
          { expression: "5x3", result: 15 },
          { expression: "9-2", result: 7 },
          { expression: "12-3", result: 9 }
        ]
      },
      {
        planetNumber: 10,
        correctAnswers: [
          { expression: "5+5", result: 10 },
          { expression: "2x5", result: 10 },
          { expression: "12-2", result: 10 },
          { expression: "13-3", result: 10 }
        ],
        wrongAnswers: [
          { expression: "4+5", result: 9 },
          { expression: "3x4", result: 12 },
          { expression: "11-2", result: 9 },
          { expression: "14-3", result: 11 }
        ]
      },
      {
        planetNumber: 12,
        correctAnswers: [
          { expression: "6+6", result: 12 },
          { expression: "3x4", result: 12 },
          { expression: "14-2", result: 12 },
          { expression: "15-3", result: 12 }
        ],
        wrongAnswers: [
          { expression: "5+6", result: 11 },
          { expression: "4x4", result: 16 },
          { expression: "13-2", result: 11 },
          { expression: "16-3", result: 13 }
        ]
      },
      {
        planetNumber: 14,
        correctAnswers: [
          { expression: "7+7", result: 14 },
          { expression: "2x7", result: 14 },
          { expression: "16-2", result: 14 },
          { expression: "17-3", result: 14 }
        ],
        wrongAnswers: [
          { expression: "6+7", result: 13 },
          { expression: "4x4", result: 16 },
          { expression: "15-2", result: 13 },
          { expression: "18-3", result: 15 }
        ]
      },
      {
        planetNumber: 15,
        correctAnswers: [
          { expression: "8+7", result: 15 },
          { expression: "3x5", result: 15 },
          { expression: "17-2", result: 15 },
          { expression: "18-3", result: 15 }
        ],
        wrongAnswers: [
          { expression: "7+7", result: 14 },
          { expression: "4x4", result: 16 },
          { expression: "16-2", result: 14 },
          { expression: "19-3", result: 16 }
        ]
      }
    ]
  },
  {
    level: 3,
    variants: [
      {
        planetNumber: 10,
        correctAnswers: [
          { expression: "5+5", result: 10 },
          { expression: "2x5", result: 10 },
          { expression: "20/2", result: 10 },
          { expression: "12-2", result: 10 }
        ],
        wrongAnswers: [
          { expression: "4+5", result: 9 },
          { expression: "3x4", result: 12 },
          { expression: "18/2", result: 9 },
          { expression: "11-2", result: 9 }
        ]
      },
      {
        planetNumber: 12,
        correctAnswers: [
          { expression: "6+6", result: 12 },
          { expression: "3x4", result: 12 },
          { expression: "24/2", result: 12 },
          { expression: "14-2", result: 12 }
        ],
        wrongAnswers: [
          { expression: "5+6", result: 11 },
          { expression: "4x4", result: 16 },
          { expression: "20/2", result: 10 },
          { expression: "13-2", result: 11 }
        ]
      },
      {
        planetNumber: 15,
        correctAnswers: [
          { expression: "8+7", result: 15 },
          { expression: "3x5", result: 15 },
          { expression: "30/2", result: 15 },
          { expression: "17-2", result: 15 }
        ],
        wrongAnswers: [
          { expression: "7+7", result: 14 },
          { expression: "4x4", result: 16 },
          { expression: "25/2", result: 12.5 },
          { expression: "16-2", result: 14 }
        ]
      },
      {
        planetNumber: 16,
        correctAnswers: [
          { expression: "8+8", result: 16 },
          { expression: "4x4", result: 16 },
          { expression: "32/2", result: 16 },
          { expression: "18-2", result: 16 }
        ],
        wrongAnswers: [
          { expression: "7+8", result: 15 },
          { expression: "5x4", result: 20 },
          { expression: "30/2", result: 15 },
          { expression: "17-2", result: 15 }
        ]
      },
      {
        planetNumber: 18,
        correctAnswers: [
          { expression: "9+9", result: 18 },
          { expression: "3x6", result: 18 },
          { expression: "36/2", result: 18 },
          { expression: "20-2", result: 18 }
        ],
        wrongAnswers: [
          { expression: "8+9", result: 17 },
          { expression: "5x4", result: 20 },
          { expression: "34/2", result: 17 },
          { expression: "19-2", result: 17 }
        ]
      },
      {
        planetNumber: 20,
        correctAnswers: [
          { expression: "10+10", result: 20 },
          { expression: "4x5", result: 20 },
          { expression: "40/2", result: 20 },
          { expression: "22-2", result: 20 }
        ],
        wrongAnswers: [
          { expression: "9+10", result: 19 },
          { expression: "5x5", result: 25 },
          { expression: "38/2", result: 19 },
          { expression: "21-2", result: 19 }
        ]
      }
    ]
  }
]

// Глобальное состояние для отслеживания текущего индекса варианта (для детерминированности)
let currentVariantIndex = 0

// Функция для получения детерминированного варианта для уровня (чтобы избежать ошибок гидратации)
export function getRandomLevelVariant(level: number): LevelVariant {
  const levelData = GRAVITY_LEVELS_DATA.find(data => data.level === level)
  if (!levelData) {
    throw new Error(`Level ${level} not found`)
  }
  
  // Используем индекс для детерминированного выбора варианта
  return levelData.variants[currentVariantIndex % levelData.variants.length]
}

// Функция для переключения на следующий вариант
export function getNextVariant(level: number): LevelVariant {
  const levelData = GRAVITY_LEVELS_DATA.find(data => data.level === level)
  if (!levelData) {
    throw new Error(`Level ${level} not found`)
  }
  
  // Увеличиваем индекс и переходим к следующему варианту
  currentVariantIndex = (currentVariantIndex + 1) % levelData.variants.length
  
  return levelData.variants[currentVariantIndex]
}

// Функция для сброса индекса варианта
export function resetVariantIndex(): void {
  currentVariantIndex = 0
}
