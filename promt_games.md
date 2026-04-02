# Правила разработки игр ThinkGames

## Основной принцип

Каждая новая игра в ThinkGames должна:

- использовать общий `GameEndModal`
- начислять фиксированные `10 XP` за успешное завершение
- сохранять результат через `saveGameResult(...)`
- автоматически участвовать в daily challenge и leaderboard через общую систему сохранения

Нельзя делать отдельную систему очков или отдельную механику наград для каждой игры.

## Обязательные правила

### Что нужно делать

- Использовать `saveGameResult(user.id, category, 10, false)` после успешного завершения игры
- Защищать сохранение от повторного вызова через `useRef`
- Показывать `GameEndModal` при завершении игры
- Передавать корректную категорию:
  - `math`
  - `ukrainian`
  - `dutch`
- Сбрасывать флаг сохранения при рестарте игры

### Чего делать не нужно

- Не считать XP по формулам
- Не добавлять случайные бонусы
- Не начислять XP за отдельные шаги, клики или ответы
- Не делать отдельные модалки завершения, если подходит `GameEndModal`
- Не дублировать логику daily challenge внутри самой игры
- Не писать отдельную логику leaderboard в каждой игре

## Как работает прогресс

### XP

- Каждая успешно завершенная игра дает `10 XP`
- XP сохраняется в `game_progress`
- Общий уровень считается от общего XP
- Один уровень = `500 XP`

### Щоденний виклик

- Daily challenge обновляется автоматически внутри `saveGameResult(...)`
- Если пользователь прошел хотя бы 1 игру за день, день засчитывается
- За 5 дней подряд начисляется 1 звезда
- Звезды и серия дней сохраняются в `daily_challenge_progress`

### Leaderboard

- Leaderboard берёт данные из `leaderboard_stats`
- Основа рейтинга:
  - сначала количество звезд
  - потом общий XP

## Базовый шаблон новой игры

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import GameEndModal from '../src/components/GameEndModal'
import { useAuth } from '../src/context/AuthContext'
import { saveGameResult } from '../src/lib/points'

export default function NewGame() {
  const { user } = useAuth()
  const hasSaved = useRef(false)
  const [isWon, setIsWon] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    if (isWon && isFinished && user?.id && !hasSaved.current) {
      hasSaved.current = true
      saveGameResult(user.id, 'math', 10, false)
    }
  }, [isWon, isFinished, user?.id])

  const resetGame = () => {
    hasSaved.current = false
    setIsWon(false)
    setIsFinished(false)
  }

  return (
    <>
      <GameEndModal
        isOpen={isFinished}
        isWon={isWon}
        onPlayAgain={resetGame}
        onSelectLevel={() => window.location.href = '/math'}
        onMainMenu={() => window.location.href = '/'}
        title={isWon ? 'Чудово!' : 'Спробуй ще раз'}
        winMessage="Гру завершено!"
        loseMessage="Спробуй ще раз!"
        playAgainText="Грати знову"
        mainMenuText="В головне меню"
        hasLevels={true}
        levelSelectHref="/math"
        showCurrentLevel={false}
      />
    </>
  )
}
```

## Паттерн сохранения

Правильный вариант:

```tsx
const hasSaved = useRef(false)

useEffect(() => {
  if (gameCompleted && user?.id && !hasSaved.current) {
    hasSaved.current = true
    saveGameResult(user.id, 'math', 10, false)
  }
}, [gameCompleted, user?.id])
```

Неправильный вариант:

```tsx
useEffect(() => {
  if (user?.id) {
    saveGameResult(user.id, 'math', 10, false)
  }
}, [user?.id])
```

Во втором случае очки могут сохраниться не по событию завершения игры, а просто по рендеру.

## Требования к UX новой игры

- Игра должна быть понятной на мобильном экране
- Завершение игры должно быть явно определено
- После победы или поражения пользователь должен получить понятное действие:
  - повторить
  - вернуться к уровням
  - выйти в главное меню

## Проверка перед завершением задачи

- Игра использует `GameEndModal`
- Очки сохраняются через `saveGameResult(...)`
- Категория указана правильно
- Сохранение не дублируется
- Рестарт игры сбрасывает `hasSaved.current`
- Победа действительно приводит к обновлению XP
- Игра автоматически участвует в daily challenge
- Игра автоматически влияет на leaderboard

## Что нужно помнить при изменениях системы

- Если меняется логика XP, нужно проверить главную страницу, профиль и leaderboard
- Если меняется логика daily challenge, нужно проверить:
  - `src/lib/dailyChallenge.ts`
  - `app/page.tsx`
  - SQL `daily-challenge-setup.sql`
- Если меняется leaderboard, нужно проверить:
  - `src/lib/leaderboard.ts`
  - `app/leaderboard/page.tsx`
  - SQL `leaderboard-setup.sql`

## Итог

Новая игра должна подключаться к уже существующей экосистеме проекта, а не создавать новую:

- единое сохранение прогресса
- единый daily challenge
- единый leaderboard
- единый UX завершения игры
