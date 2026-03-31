'use client'

interface GameEndModalProps {
  isOpen: boolean
  isWon: boolean
  correctAnswer?: string
  onPlayAgain: () => void
  onSelectLevel?: () => void
  onMainMenu: () => void
  title?: string
  winMessage?: string
  loseMessage?: string
  playAgainText?: string
  selectLevelText?: string
  mainMenuText?: string
  hasLevels?: boolean
  currentLevel?: string
  levelSelectHref?: string
  mainMenuHref?: string
}

export default function GameEndModal({
  isOpen,
  isWon,
  correctAnswer,
  onPlayAgain,
  onSelectLevel,
  onMainMenu,
  title = 'Результат гри',
  winMessage = 'Вітаю!',
  loseMessage = 'Спробуйте ще раз!',
  playAgainText = 'Спробувати ще',
  selectLevelText = 'Вибрати рівень',
  mainMenuText = 'На головну',
  hasLevels = true,
  currentLevel = '',
  levelSelectHref = '/math',
  mainMenuHref = '/'
}: GameEndModalProps) {
  if (!isOpen) return null

  const buttons = []
  
  // Кнопка "Спробувати ще" - всегда есть
  buttons.push({
    text: playAgainText,
    onClick: onPlayAgain,
    color: 'bg-green-500 hover:bg-green-600'
  })

  // Кнопка уровней - если есть функция onSelectLevel
  if (onSelectLevel) {
    buttons.push({
      text: selectLevelText,
      onClick: onSelectLevel,
      color: 'bg-blue-500 hover:bg-blue-600'
    })
  }

  // Кнопка "На головну" - всегда есть
  buttons.push({
    text: mainMenuText,
    onClick: onMainMenu,
    color: 'bg-gray-500 hover:bg-gray-600'
  })

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full text-center">
        {/* Иконка */}
        <div className="text-6xl mb-4">
          {isWon ? '🎉' : '😔'}
        </div>
        
        {/* Заголовок */}
        <h2 className="text-2xl font-bold mb-2">
          {isWon ? winMessage : loseMessage}
        </h2>
        
        {/* Основной заголовок */}
        <p className="text-lg font-medium text-gray-800 mb-2">
          {title}
        </p>
        
        {/* Правильный ответ (если есть) */}
        {!isWon && correctAnswer && (
          <p className="text-gray-600 mb-6">
            Правильна відповідь: <span className="font-bold">{correctAnswer}</span>
          </p>
        )}
        
        {/* Кнопки */}
        <div className="flex flex-col gap-3">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={button.onClick}
              className={`w-full py-3 px-4 ${button.color} text-white rounded-lg font-medium transition-all`}
            >
              {button.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
