# Правила разработки игр ThinkGames

## 🎯 Основная концепция

**Каждая игра должна использовать универсальное модальное окно GameEndModal в конце игры и начислять ровно 10 очков за завершенный уровень/игру.** Никаких сложных формул, множителей или бонусов.

## 📋 Обязательные правила для всех игр

### ✅ Что делать:
- **GameEndModal** для завершения игры (обязательно!)
- **10 очков** за завершенный уровень/игру
- **Единоразово** - только один раз за игру
- **Фиксированное значение** - никаких расчетов
- **useRef для защиты** - `hasSaved.current = false` по умолчанию
- **useEffect для сохранения** - при победе/завершении

### ❌ Что НЕ делать:
- **Никаких кастомных модальных окон** - только GameEndModal
- **Никаких формул** расчета очков
- **Никаких множителей** за скорость/точность
- **Никаких бонусов** за чистую игру
- **Никаких очков** за отдельные действия/ответы
- **Никаких calculateScore** функций

## 🎮 Универсальное модальное окно GameEndModal

### Обязательные пропсы для всех игр:
```typescript
<GameEndModal
  isOpen={gameCompleted}           // Открыто ли модальное окно
  isWon={true}                     // Победа или поражение
  onPlayAgain={resetGame}          // Повторить игру
  onSelectLevel={handleSelectLevel} // К выбору уровней
  onMainMenu={handleMainMenu}      // В главное меню
  title="Чудово!"                 // Заголовок
  winMessage="Гру завершено!"      // Сообщение о победе
  playAgainText="Грати знову"      // Текст кнопки повтора
  mainMenuText="В головне меню"    // Текст кнопки меню
  hasLevels={true}                 // Есть ли уровни
  levelSelectHref="/path/to/levels" // Ссылка на уровни
  showCurrentLevel={false}         // Показывать ли текущий уровень
/>
```

### Правильные ссылки для разных игр:
- **Математика**: `levelSelectHref="/math/[game]`, `onMainMenu={() => window.location.href = '/math'}`
- **Нидерландская**: `levelSelectHref="/dutch/[game]`, `onMainMenu={() => window.location.href = '/dutch'}`
- **Украинская**: `levelSelectHref="/ukrainian/[game]`, `onMainMenu={() => window.location.href = '/ukrainian'}`

## 🔧 Шаблон кода для новой игры

```typescript
'use client'

import { useState, useEffect, useRef } from 'react'
import { saveGameResult } from '../src/lib/points'
import { useAuth } from '../src/context/AuthContext'
import GameEndModal from '../src/components/GameEndModal'

export default function NewGameComponent() {
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing')
  const { user } = useAuth()
  const hasSaved = useRef(false)

  // Сохранение очков при победе
  useEffect(() => {
    if (gameStatus === 'won' && !hasSaved.current && user?.id) {
      hasSaved.current = true;
      saveGameResult(user.id, 'math' | 'ukrainian' | 'dutch', 10, false);
      console.log('!!! NEW GAME COMPLETE: 10 XP SENT !!!');
    }
  }, [gameStatus, user?.id]);

  // Сброс при новой игре
  const resetGame = () => {
    setGameStatus('playing');
    hasSaved.current = false;
    // ... сброс остальных состояний
  };

  const handleSelectLevel = () => {
    window.location.href = '/[category]/[game]/levels';
  };

  const handleMainMenu = () => {
    window.location.href = '/[category]';
  };

  return (
    <div>
      {/* ... игровой интерфейс */}
      
      {/* Универсальное модальное окно */}
      <GameEndModal
        isOpen={gameStatus === 'won' || gameStatus === 'lost'}
        isWon={gameStatus === 'won'}
        onPlayAgain={resetGame}
        onSelectLevel={handleSelectLevel}
        onMainMenu={handleMainMenu}
        title={gameStatus === 'won' ? 'Чудово!' : 'Гра закінчена'}
        winMessage="Гру завершено!"
        loseMessage="Спробуйте ще раз!"
        playAgainText="Грати знову"
        mainMenuText="В головне меню"
        hasLevels={true}
        levelSelectHref="/[category]/[game]/levels"
        showCurrentLevel={false}
      />
    </div>
  )
}
```

## 🎮 Примеры правильных реализаций

### 1. ConnectPairsGame (З'єднай пару/слова)
```typescript
// Сохранение очков
useEffect(() => {
  if (matchedPairs === items.length && matchedPairs > 0 && user?.id && !hasSavedResult.current) {
    hasSavedResult.current = true;
    saveGameResult(user.id, category, 10, false);
  }
}, [matchedPairs, items.length]);

// Модальное окно
<GameEndModal
  isOpen={matchedPairs === items.length}
  isWon={true}
  onPlayAgain={initializeGame}
  onSelectLevel={() => router.push('/[category]/[game]')}
  onMainMenu={() => router.push('/[category]')}
  title="Чудово!"
  winMessage="Гру завершено!"
  playAgainText="Ще раз"
  mainMenuText="В головне меню"
  hasLevels={true}
  levelSelectHref="/[category]/[game]"
  showCurrentLevel={false}
/>
```

### 2. BalloonSweeperGame (Кульковий сапер)
```typescript
// Сохранение очков
useEffect(() => {
  if (status === 'won' && !hasSaved.current && user?.id) {
    hasSaved.current = true;
    saveGameResult(user.id, 'math', 10, false);
  }
}, [status, user?.id]);

// Модальное окно
<GameEndModal
  isOpen={status === 'won' || status === 'lost'}
  isWon={status === 'won'}
  onPlayAgain={resetGame}
  onSelectLevel={() => window.location.href = '/math/balloon-sweeper'}
  onMainMenu={() => window.location.href = '/math'}
  title={status === 'won' ? 'Чудово!' : 'Гра закінчена'}
  winMessage="Ура, поле очищено!"
  loseMessage="Кулька луснула!"
  playAgainText="Почати знову"
  mainMenuText="В головне меню"
  hasLevels={true}
  levelSelectHref="/math/balloon-sweeper"
  showCurrentLevel={false}
/>
```

### 3. Ukrainian Write Word (Напиши слово)
```typescript
// Сохранение очков
useEffect(() => {
  if (showLevelComplete && !hasSaved.current && user?.id) {
    hasSaved.current = true;
    saveGameResult(user.id, 'ukrainian', 10, false);
  }
}, [showLevelComplete, user?.id]);

// Модальное окно
<GameEndModal
  isOpen={showLevelComplete}
  isWon={true}
  onPlayAgain={() => {
    setShowLevelComplete(false);
    initializeLevel();
  }}
  onSelectLevel={() => router.push('/ukrainian/write-word/levels')}
  onMainMenu={() => router.push('/ukrainian')}
  title="Чудово!"
  winMessage={`Рівень ${currentLevel} завершено!`}
  playAgainText="Повторити рівень"
  mainMenuText="В головне меню"
  hasLevels={true}
  levelSelectHref="/ukrainian/write-word/levels"
  showCurrentLevel={false}
/>
```

## 🏷️ Категории игр

- **'math'** - математические игры
- **'ukrainian'** - украинские игры  
- **'dutch'** - голландские игры

## ⚠️ Частые ошибки и как их избежать

### Ошибка 1: Кастомное модальное окно
```typescript
// ПЛОХО - кастомное модальное окно
{gameCompleted && (
  <motion.div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
    <div className="bg-white rounded-2xl p-8">
      <h2>🎉 Игра завершена!</h2>
      <button onClick={resetGame}>Сыграть еще</button>
    </div>
  </motion.div>
)}

// ХОРОШО - универсальное GameEndModal
<GameEndModal
  isOpen={gameCompleted}
  isWon={true}
  onPlayAgain={resetGame}
  onSelectLevel={handleSelectLevel}
  onMainMenu={handleMainMenu}
  // ... остальные пропсы
/>
```

### Ошибка 2: Множественные вызовы saveGameResult
```typescript
// ПЛОХО - будет вызываться многократно
useEffect(() => {
  saveGameResult(user.id, 'math', 10, false); // Каждый рендер!
}, [user?.id]);

// ХОРОШО - защита через useRef
useEffect(() => {
  if (gameStatus === 'won' && !hasSaved.current && user?.id) {
    hasSaved.current = true;
    saveGameResult(user.id, 'math', 10, false);
  }
}, [gameStatus, user?.id]);
```

### Ошибка 3: Сложные формулы расчета
```typescript
// ПЛОХО - генерирует большие числа
const score = calculateScore(moves, level, gridSize); // Может быть 1000+

// ХОРОШО - фиксированное значение
const score = 10;
```

## 🔄 Порядок действий при создании новой игры

1. **Добавить импорты:** `useEffect, useRef`, `saveGameResult`, `useAuth`, `GameEndModal`
2. **Создать состояние:** `gameStatus` или аналогичное
3. **Добавить useRef:** `const hasSaved = useRef(false)`
4. **Написать useEffect:** для сохранения при победе
5. **Добавить GameEndModal:** с правильными пропсами
6. **Настроить навигацию:** правильные ссылки для категории
7. **Сбросить hasSaved:** в resetGame или при инициализации
8. **Тестировать:** убедиться что очки сохраняются 1 раз и модальное окно работает

## 🧪 Тестирование

После реализации игры проверьте:
1. **GameEndModal появляется** при победе/поражении
2. **Все 3 кнопки работают** (повтор, уровни, меню)
3. **Ссылки ведут правильно** на свою категорию
4. **Очки сохраняются** при победе
5. **Только 1 раз** за игру
6. **Правильная категория** передается
7. **Нет множественных вызовов** в консоли
8. **Нет больших чисел** (больше 100) в логах

## 📝 Чек-лист перед коммитом

- [ ] Используется GameEndModal (обязательно!)
- [ ] Используется фиксированное значение 10 очков
- [ ] Есть защита через `hasSaved.current`
- [ ] useEffect имеет правильные зависимости
- [ ] Категория правильная ('math' | 'ukrainian' | 'dutch')
- [ ] Ссылки ведут на правильные разделы
- [ ] Нет calculateScore или других формул
- [ ] Протестировано что работает
- [ ] Все 3 кнопки в модальном окне работают

---

**Следуйте этим правилам и все игры будут иметь консистентный UX и корректно начислять очки!** 🎮✨
