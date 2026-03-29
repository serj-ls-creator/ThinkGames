'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UKRAINIAN_LEVELS } from '../../../../../src/constants/ukrainianWords'
import { saveGameResult } from '../../../../../src/lib/points'
import { useAuth } from '@/src/context/AuthContext'

interface LetterButton {
  letter: string
  id: string
  isUsed: boolean
}

interface WriteWordGamePageProps {
  params: {
    level: string
  }
}

export default function WriteWordGamePage({ params }: WriteWordGamePageProps) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  
  const [currentLevel, setCurrentLevel] = useState(parseInt(params.level))
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [letterButtons, setLetterButtons] = useState<LetterButton[]>([])
  const [inputSlots, setInputSlots] = useState<(string | null)[]>([])
  const [score, setScore] = useState(0)
  const [isShaking, setIsShaking] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showLevelComplete, setShowLevelComplete] = useState(false)
  const [mistakes, setMistakes] = useState(0)
  const [levelMistakes, setLevelMistakes] = useState(0)

  const currentLevelData = UKRAINIAN_LEVELS.find(level => level.level === currentLevel)
  const currentWord = currentLevelData?.words[currentWordIndex] || ''

  // Отказоустойчивая функция озвучки для Chrome/Edge на Windows
  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    const lang = 'uk-UA';
    
    const performSpeak = () => {
      synth.cancel();
      const voices = synth.getVoices();
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Ищем голос максимально точно
      const targetVoice = voices.find(v => 
        v.lang.replace('_', '-').toLowerCase() === lang.toLowerCase() ||
        v.lang.toLowerCase().startsWith(lang.split('-')[0])
      );

      if (targetVoice) {
        utterance.voice = targetVoice;
      }
      
      utterance.lang = lang;
      utterance.rate = 0.9; // Чуть медленнее для четкости
      synth.speak(utterance);
    };

    if (synth.getVoices().length === 0) {
      // Если голоса еще не подгрузились, ждем и пробуем снова
      synth.onvoiceschanged = () => performSpeak();
    } else {
      performSpeak();
    }
  };

  // Глобальная инициализация голосов для Chrome
  useEffect(() => {
    // Нужно вызвать это при старте, чтобы Chrome «проснулся»
    window.speechSynthesis.getVoices();
  }, []);

  // Инициализация игры
  useEffect(() => {
    if (currentWord) {
      initializeWord()
    }
  }, [currentWord])

  // Автоматическая озвучка при старте нового слова
  useEffect(() => {
    if (currentWord) {
      setTimeout(() => speak(currentWord), 500)
    }
  }, [currentWord])

  const initializeWord = () => {
    const letters = currentWord.split('')
    const shuffledLetters = [...letters].sort(() => Math.random() - 0.5)
    
    const buttons: LetterButton[] = shuffledLetters.map((letter, index) => ({
      letter,
      id: `letter-${index}`,
      isUsed: false
    }))

    setLetterButtons(buttons)
    setInputSlots(new Array(currentWord.length).fill(null))
    setShowSuccess(false)
  }

  const handleLetterClick = (buttonId: string) => {
    const button = letterButtons.find(b => b.id === buttonId)
    if (!button || button.isUsed) return

    // Находим первую пустую ячейку
    const emptySlotIndex = inputSlots.findIndex(slot => slot === null)
    if (emptySlotIndex === -1) return

    // Перемещаем букву в ячейку
    setLetterButtons(prev => prev.map(b => 
      b.id === buttonId ? { ...b, isUsed: true } : b
    ))
    setInputSlots(prev => prev.map((slot, index) => 
      index === emptySlotIndex ? button.letter : slot
    ))

    // Проверяем, заполнено ли слово
    const newInputSlots = [...inputSlots]
    newInputSlots[emptySlotIndex] = button.letter
    
    if (newInputSlots.every(slot => slot !== null)) {
      checkWord(newInputSlots.join(''))
    }
  }

  const checkWord = async (assembledWord: string) => {
    if (assembledWord === currentWord) {
      // Правильное слово - без озвучки
      setShowSuccess(true)
      
      // Сохраняем +1 XP в Supabase
      if (user?.id) {
        await saveGameResult(user.id, 'ukrainian', 1)
      } else {
        console.log("Анонимный игрок, очки не шлем")
      }
      
      setScore(prev => prev + 1)
      
      setTimeout(() => {
        moveToNextWord()
      }, 2000)
    } else {
      // Неправильное слово - без озвучки
      setIsShaking(true)
      setMistakes(prev => prev + 1)
      setLevelMistakes(prev => prev + 1)
      
      setTimeout(() => {
        resetLetters()
        setIsShaking(false)
      }, 1000)
    }
  }

  const resetLetters = () => {
    // Возвращаем все буквы обратно
    setLetterButtons(prev => prev.map(b => ({ ...b, isUsed: false })))
    setInputSlots(new Array(currentWord.length).fill(null))
  }

  const handleBackspaceClick = () => {
    // Находим последнюю заполненную ячейку
    const lastFilledIndex = inputSlots.slice().reverse().findIndex(slot => slot !== null)
    if (lastFilledIndex === -1) return
    
    const actualIndex = inputSlots.length - 1 - lastFilledIndex
    const removedLetter = inputSlots[actualIndex]
    
    if (!removedLetter) return
    
    // Находим соответствующую кнопку буквы и делаем ее активной
    setLetterButtons(prev => prev.map(button => {
      if (button.letter === removedLetter && button.isUsed) {
        return { ...button, isUsed: false }
      }
      return button
    }))
    
    // Очищаем ячейку
    setInputSlots(prev => prev.map((slot, index) => 
      index === actualIndex ? null : slot
    ))
  }

  const moveToNextWord = async () => {
    const wordsInLevel = currentLevelData?.words.length || 0
    
    if (currentWordIndex < wordsInLevel - 1) {
      setCurrentWordIndex(prev => prev + 1)
    } else {
      // Уровень завершен - проверяем бонусы
      if (levelMistakes === 0) {
        if (user?.id) {
          await saveGameResult(user.id, 'ukrainian', 0, true)
        } else {
          console.log("Анонимный игрок, бонусные очки не шлем")
        }
      }
      setShowLevelComplete(true)
    }
  }

  const handleBackToLevels = () => {
    router.push('/ukrainian/write-word/levels')
  }

  const handleNextLevel = () => {
    if (currentLevel < 10) {
      router.push(`/ukrainian/write-word/level/${currentLevel + 1}`)
    } else {
      router.push('/ukrainian/write-word/levels')
    }
  }

  if (authLoading) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-800 mb-4">Завантаження гри...</div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    </div>
  }

  if (!currentLevelData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Рівень не знайдено</h1>
          <Link
            href="/ukrainian/write-word/levels"
            className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full transition-colors"
          >
            ← До списку рівнів
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Навигация */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/ukrainian/write-word/levels"
            className="inline-flex items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md text-gray-700 hover:text-blue-600 transition-colors"
          >
            ← До списку рівнів
          </Link>
        </motion.div>

        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Напиши слово
          </h1>
          <p className="text-lg text-gray-600">
            {currentLevelData.title} • Слово {currentWordIndex + 1}/{currentLevelData.words.length}
          </p>
        </motion.div>

        {/* Оценка */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center bg-white rounded-full px-6 py-3 shadow-lg">
            <span className="text-2xl mr-2">⭐</span>
            <span className="text-xl font-semibold text-gray-800">{score}</span>
          </div>
        </motion.div>

        {/* Кнопка озвучки слова */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <button
            onClick={() => speak(currentWord)}
            className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-lg transition-colors text-lg font-semibold"
          >
            🔊 Послухати слово
          </button>
        </motion.div>

        {/* Ячейки для ввода */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`flex justify-center gap-2 mb-12 ${isShaking ? 'animate-shake' : ''}`}
        >
          {inputSlots.map((letter, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="w-16 h-16 bg-white border-3 border-gray-300 rounded-2xl flex items-center justify-center shadow-md"
            >
              <span className="text-2xl font-bold text-gray-800">
                {letter || ''}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Кнопки с буквами */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-4"
        >
          {letterButtons.map((button, index) => (
            <motion.button
              key={button.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: button.isUsed ? 0.3 : 1, scale: button.isUsed ? 0.8 : 1 }}
              transition={{ delay: 0.7 + index * 0.05 }}
              whileHover={{ scale: button.isUsed ? 0.8 : 1.05 }}
              whileTap={{ scale: button.isUsed ? 0.7 : 0.95 }}
              onClick={() => handleLetterClick(button.id)}
              disabled={button.isUsed}
              className={`w-14 h-14 rounded-xl font-bold text-xl shadow-lg transition-all ${
                button.isUsed
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-br from-blue-400 to-purple-500 text-white hover:from-blue-500 hover:to-purple-600 cursor-pointer'
              }`}
            >
              {button.letter}
            </motion.button>
          ))}
        </motion.div>

        {/* Кнопка «Стерти» под буквами */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-md mx-auto"
        >
          <button
            onClick={handleBackspaceClick}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 rounded-2xl shadow-lg transition-colors text-lg font-semibold flex items-center justify-center gap-2"
          >
            <span className="text-2xl">←</span>
            <span>Стерти останню букву</span>
          </button>
        </motion.div>

        {/* Сообщение об успехе */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl">
              <h2 className="text-3xl font-bold">🎉 Вірно!</h2>
            </div>
          </motion.div>
        )}

        {/* Завершение уровня */}
        {showLevelComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
          >
            <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-4">
              <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🎉 Рівень завершено!
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Ти успішно пройшов рівень {currentLevel}!
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleNextLevel}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-full transition-colors font-semibold"
                >
                  {currentLevel < 10 ? `Наступний рівень →` : 'До списку рівнів'}
                </button>
                <button
                  onClick={handleBackToLevels}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-full transition-colors font-semibold"
                >
                  До списку рівнів
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Стили для анимации встряски */}
        <style jsx>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
        `}</style>
      </div>
    </div>
  )
}
