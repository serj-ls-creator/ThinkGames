# Правила начисления очков в играх ThinkGames

## 🎯 Основная концепция

**Каждая игра должна начислять ровно 10 очков за завершенный уровень/игру.** Никаких сложных формул, множителей или бонусов.

## 📋 Обязательные правила для всех игр

### ✅ Что делать:
- **10 очков** за завершенный уровень/игру
- **Единоразово** - только один раз за игру
- **Фиксированное значение** - никаких расчетов
- **useRef для защиты** - `hasSaved.current = false` по умолчанию
- **useEffect для сохранения** - при победе/завершении

### ❌ Что НЕ делать:
- **Никаких формул** расчета очков
- **Никаких множителей** за скорость/точность
- **Никаких бонусов** за чистую игру
- **Никаких очков** за отдельные действия/ответы
- **Никаких calculateScore** функций

## 🔧 Шаблон кода для новой игры

```typescript
'use client'

import { useState, useEffect, useRef } from 'react'
import { saveGameResult } from '../src/lib/points'
import { useAuth } from '../src/context/AuthContext'

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

  return (
    // ... JSX компонента
  )
}
```

## 🎮 Примеры правильных реализаций

### 1. ConnectPairsGame (З'єднай пару/слова)
```typescript
useEffect(() => {
  if (matchedPairs === items.length && matchedPairs > 0 && user?.id && !hasSavedResult.current) {
    hasSavedResult.current = true;
    saveGameResult(user.id, category, 10, mistakes === 0);
  }
}, [matchedPairs, items.length]);
```

### 2. BalloonSweeperGame (Кульковий сапер)
```typescript
useEffect(() => {
  if (status === 'won' && !hasSaved.current && user?.id) {
    hasSaved.current = true;
    saveGameResult(user.id, 'math', 10, false);
  }
}, [status, user?.id]);
```

### 3. Ukrainian Write Word (Напиши слово)
```typescript
useEffect(() => {
  if (showLevelComplete && !hasSaved.current && user?.id) {
    hasSaved.current = true;
    saveGameResult(user.id, 'ukrainian', 10, mistakes === 0);
  }
}, [showLevelComplete, user?.id]);
```

## 🏷️ Категории игр

- **'math'** - математические игры
- **'ukrainian'** - украинские игры  
- **'dutch'** - голландские игры

## ⚠️ Частые ошибки и как их избежать

### Ошибка 1: Множественные вызовы saveGameResult
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

### Ошибка 2: Сложные формулы расчета
```typescript
// ПЛОХО - генерирует большие числа
const score = calculateScore(moves, level, gridSize); // Может быть 1000+

// ХОРОШО - фиксированное значение
const score = 10;
```

### Ошибка 3: Неправильные зависимости useEffect
```typescript
// ПЛОХО - лишние зависимости вызывают повторные сохранения
useEffect(() => {
  // ... логика сохранения
}, [matchedPairs, items.length, user?.id, category, mistakes]);

// ХОРОШО - только нужные зависимости
useEffect(() => {
  // ... логика сохранения  
}, [gameStatus, user?.id]);
```

## 🔄 Порядок действий при создании новой игры

1. **Добавить импорты:** `useEffect, useRef`, `saveGameResult`, `useAuth`
2. **Создать состояние:** `gameStatus` или аналогичное
3. **Добавить useRef:** `const hasSaved = useRef(false)`
4. **Написать useEffect:** для сохранения при победе
5. **Сбросить hasSaved:** в resetGame или при инициализации
6. **Тестировать:** убедиться что очки сохраняются 1 раз

## 🧪 Тестирование

После реализации игры проверьте:
1. **Очки сохраняются** при победе
2. **Только 1 раз** за игру
3. **Правильная категория** передается
4. **Нет множественных вызовов** в консоли
5. **Нет больших чисел** (больше 100) в логах

## 📝 Чек-лист перед коммитом

- [ ] Используется фиксированное значение 10 очков
- [ ] Есть защита через `hasSaved.current`
- [ ] useEffect имеет правильные зависимости
- [ ] Категория правильная ('math' | 'ukrainian' | 'dutch')
- [ ] Нет calculateScore или других формул
- [ ] Протестировано что работает

---

**Следуйте этим правилам и все игры будут корректно начислять очки!** 🎮✨
