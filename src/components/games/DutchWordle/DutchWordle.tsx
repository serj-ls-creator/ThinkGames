'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getRandomWord, DutchWord } from '@/src/data/dutchWords'
import { useAuth } from '@/src/context/AuthContext'
import { saveGameResult } from '@/src/lib/points'

interface DutchWordleProps {
  level: number
}

interface LetterButton {
  letter: string
  id: string
  status?: 'correct' | 'present' | 'absent' | 'unused'
}

interface GuessRow {
  letters: (string | null)[]
  submitted: boolean
}

export default function DutchWordle({ level }: DutchWordleProps) {
  const router = useRouter()
  const { user } = useAuth()
  
  const [currentWord, setCurrentWord] = useState('')
  const [currentHint, setCurrentHint] = useState('')
  const [guessRows, setGuessRows] = useState<GuessRow[]>([])
  const [currentRow, setCurrentRow] = useState(0)
  const [currentCol, setCurrentCol] = useState(0)
  const [letterButtons, setLetterButtons] = useState<LetterButton[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  
  const maxAttempts = 6

  const initializeGame = () => {
    const wordData = getRandomWord(level)
    
    setCurrentWord(wordData.word)
    setCurrentHint(wordData.hint)
    
    // Создаем пустые ряды для попыток
    const initialRows: GuessRow[] = Array(maxAttempts).fill(null).map(() => ({
      letters: Array(level).fill(null),
      submitted: false
    }))
    
    setGuessRows(initialRows)
    setCurrentRow(0)
    setCurrentCol(0)
    setShowHint(false)
    setShowSuccessModal(false)
    setGameOver(false)
    setGameWon(false)
    
    // Создаем кнопки с алфавитом
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const buttons: LetterButton[] = alphabet.map((letter, index) => ({
      letter,
      id: `letter-${index}`,
      status: 'unused'
    }))

    setLetterButtons(buttons)
  }

  useEffect(() => {
    initializeGame()
  }, [level])

  const handleLetterClick = (letter: string) => {
    if (gameOver || currentCol >= level || currentRow >= maxAttempts) return
    
    const newGuessRows = [...guessRows]
    newGuessRows[currentRow].letters[currentCol] = letter
    setGuessRows(newGuessRows)
    setCurrentCol(currentCol + 1)
  }

  const handleBackspace = () => {
    if (gameOver || currentCol === 0) return
    
    const newGuessRows = [...guessRows]
    newGuessRows[currentRow].letters[currentCol - 1] = null
    setGuessRows(newGuessRows)
    setCurrentCol(currentCol - 1)
  }

  const getLetterStatus = (letter: string, position: number): 'correct' | 'present' | 'absent' => {
    const letterLower = letter.toLowerCase()
    const wordChar = currentWord[position]
    
    if (wordChar === letterLower) {
      return 'correct' // Правильная буква на правильном месте
    } else if (currentWord.toLowerCase().includes(letterLower)) {
      return 'present' // Буква есть в слове но на другом месте
    } else {
      return 'absent' // Буквы нет в слове
    }
  }

  const updateKeyboardStatus = (submittedRow: GuessRow) => {
    const newLetterButtons = [...letterButtons]
    
    submittedRow.letters.forEach((letter, index) => {
      if (!letter) return
      
      const status = getLetterStatus(letter, index)
      const buttonIndex = newLetterButtons.findIndex(btn => btn.letter === letter)
      
      if (buttonIndex !== -1) {
        const currentStatus = newLetterButtons[buttonIndex].status
        const newStatus = status
        
        // Обновляем статус только если он лучше предыдущего
        // correct > present > absent > unused
        if (
          currentStatus === 'unused' ||
          (currentStatus === 'absent' && newStatus !== 'absent') ||
          (currentStatus === 'present' && newStatus === 'correct')
        ) {
          newLetterButtons[buttonIndex].status = newStatus
        }
      }
    })
    
    setLetterButtons(newLetterButtons)
  }

  const handleSubmit = () => {
    if (gameOver || currentCol !== level) return
    
    const currentGuess = guessRows[currentRow].letters.join('')
    const currentGuessLower = currentGuess.toLowerCase()
    
    // Помечаем текущий ряд как отправленный
    const newGuessRows = [...guessRows]
    newGuessRows[currentRow].submitted = true
    setGuessRows(newGuessRows)
    
    // Обновляем статусы букв на клавиатуре
    updateKeyboardStatus(newGuessRows[currentRow])
    
    if (currentGuessLower === currentWord) {
      // Правильное слово!
      setGameWon(true)
      setGameOver(true)
      setShowSuccessModal(true)
      
      // Сохраняем результат
      setTimeout(async () => {
        if (user?.id) {
          await saveGameResult(user.id, 'dutch', 10, true)
        }
      }, 1000)
    } else {
      // Неправильное слово, переходим к следующей строке
      if (currentRow < maxAttempts - 1) {
        setCurrentRow(currentRow + 1)
        setCurrentCol(0)
      } else {
        // Закончились попытки
        setGameOver(true)
        setShowSuccessModal(true)
        
        // Сохраняем результат (проигрыш)
        setTimeout(async () => {
          if (user?.id) {
            await saveGameResult(user.id, 'dutch', 10, false)
          }
        }, 1000)
      }
    }
  }

  const handleHint = () => {
    if (gameOver) return
    setShowHint(true)
  }

  const handlePlayAgain = () => {
    initializeGame()
  }

  const handleSelectLevel = () => {
    router.push('/dutch/wordle/levels')
  }

  const handleMainMenu = () => {
    router.push('/dutch')
  }

  const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Заголовок с кнопкой назад */}
        <div className="text-center mb-6">
          <div className="max-w-2xl mx-auto mb-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
              <button
                onClick={() => router.push('/dutch/wordle/levels')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50 w-full sm:w-auto justify-center sm:justify-start"
              >
                ← Назад до рівнів
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left w-full sm:w-auto">
                Вгадай слово
              </h1>
            </div>
          </div>
          <p className="text-gray-600">Рівень: {level} букв</p>
        </div>

        {/* Подсказка */}
        {showHint && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-center">
            <p className="text-sm font-medium text-yellow-800">
              💡 {currentHint}
            </p>
          </div>
        )}

        {/* Игровое поле */}
        <div className="mb-6">
          <div className="flex flex-col gap-2 max-w-md mx-auto">
            {guessRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-2 justify-center">
                {row.letters.map((letter, colIndex) => {
                  let status = ''
                  if (row.submitted && letter) {
                    status = getLetterStatus(letter, colIndex)
                  }
                  
                  return (
                    <div
                      key={colIndex}
                      className={`w-12 h-12 sm:w-14 sm:h-14 border-2 rounded flex items-center justify-center text-xl sm:text-2xl font-bold transition-all
                        ${!letter 
                          ? 'border-gray-300 bg-white' 
                          : !row.submitted
                            ? 'border-blue-400 bg-blue-50 text-blue-700'
                            : status === 'correct'
                              ? 'bg-green-500 border-green-600 text-white'
                              : status === 'present'
                                ? 'bg-yellow-500 border-yellow-600 text-white'
                                : 'bg-gray-500 border-gray-600 text-white'
                        }
                      `}
                      style={{
                        backgroundColor: !letter ? '#ffffff' : 
                                         !row.submitted ? '#dbeafe' : 
                                         status === 'correct' ? '#10b981' : 
                                         status === 'present' ? '#eab308' : 
                                         '#6b7280',
                        borderColor: !letter ? '#d1d5db' : 
                                      !row.submitted ? '#60a5fa' : 
                                      status === 'correct' ? '#059669' : 
                                      status === 'present' ? '#ca8a04' : 
                                      '#4b5563',
                        color: !letter ? '#000000' : 
                                  !row.submitted ? '#1d4ed8' : 
                                  '#ffffff'
                      }}
                    >
                      {letter || ''}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Виртуальная клавиатура */}
        <div className="mb-6">
          <div className="flex flex-col gap-3 max-w-lg mx-auto">
            {keyboardLayout.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-2 justify-center">
                {row.map(letter => {
                  const button = letterButtons.find(btn => btn.letter === letter)
                  const status = button?.status || 'unused'
                  
                  return (
                    <button
                      key={letter}
                      onClick={() => handleLetterClick(letter)}
                      disabled={gameOver}
                      className={`w-8 h-12 sm:w-10 sm:h-14 rounded font-bold text-sm sm:text-base transition-all border-2 flex items-center justify-center
                        ${status === 'correct'
                          ? 'bg-green-500 text-white border-green-600'
                          : status === 'present'
                            ? 'bg-yellow-500 text-white border-yellow-600'
                            : status === 'absent'
                              ? 'bg-gray-500 text-white border-gray-600'
                              : 'bg-blue-500 text-white border-blue-600 hover:bg-blue-600'
                        }
                        ${gameOver ? 'cursor-not-allowed opacity-75' : 'active:scale-95 shadow-md'}
                      `}
                      style={{
                        backgroundColor: status === 'correct' ? '#10b981' : 
                                       status === 'present' ? '#eab308' : 
                                       status === 'absent' ? '#6b7280' : '#3b82f6',
                        color: '#ffffff',
                        borderColor: status === 'correct' ? '#059669' : 
                                     status === 'present' ? '#ca8a04' : 
                                     status === 'absent' ? '#4b5563' : '#2563eb'
                      }}
                    >
                      {letter}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Кнопки управления */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={handleBackspace}
            disabled={gameOver}
            className="px-3 h-12 sm:px-4 sm:h-14 rounded bg-gray-500 text-white hover:bg-gray-600 transition-all font-bold text-sm sm:text-base border-2 border-gray-600 shadow-md disabled:opacity-75"
          >
            ⌫
          </button>
          <button
            onClick={handleSubmit}
            disabled={gameOver || currentCol !== level}
            className="px-3 h-12 sm:px-4 sm:h-14 rounded bg-green-500 text-white hover:bg-green-600 transition-all font-bold text-sm sm:text-base border-2 border-green-600 shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-75"
          >
            ✓
          </button>
          <button
            onClick={handleHint}
            disabled={gameOver}
            className="px-3 h-12 sm:px-4 sm:h-14 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition-all font-bold text-sm sm:text-base border-2 border-yellow-600 shadow-md disabled:opacity-75"
          >
            💡
          </button>
        </div>

        {/* Модальное окно победы/поражения */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full text-center">
              <div className="text-6xl mb-4">
                {gameWon ? '🎉' : '😔'}
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {gameWon ? 'Вітаю!' : 'Спробуйте ще раз!'}
              </h2>
              <p className="text-gray-600 mb-6">
                {gameWon 
                  ? 'Ви вгадали слово!' 
                  : `Правильне слово: ${currentWord.toUpperCase()}`
                }
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handlePlayAgain}
                  className="w-full py-3 px-4 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all"
                >
                  Ще раз
                </button>
                <button
                  onClick={handleSelectLevel}
                  className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all"
                >
                  Вибрати рівень
                </button>
                <button
                  onClick={handleMainMenu}
                  className="w-full py-3 px-4 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-all"
                >
                  В головне меню
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
