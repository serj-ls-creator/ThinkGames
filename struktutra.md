# Структура проекта ThinkGames

## Общая схема

```text
ThinkGames/
├── app/                          # Маршруты Next.js App Router
├── components/                   # Отдельные игровые client-компоненты верхнего уровня
├── public/                       # Статические файлы
├── src/
│   ├── components/               # Основные UI и игровые компоненты
│   ├── constants/                # Словари и константы
│   ├── context/                  # AuthContext
│   ├── data/                     # Данные игр и daily messages
│   ├── lib/                      # Supabase, XP, leaderboard, speech, game helpers
│   ├── store/                    # Zustand store
│   └── types/                    # Общие типы
├── database-setup.sql            # Базовая настройка Supabase profiles
├── daily-challenge-setup.sql     # Таблица daily_challenge_progress
├── leaderboard-setup.sql         # View leaderboard_stats
├── README.md
├── status.md
└── struktutra.md
```

## Основные маршруты

- `app/page.tsx` — главная страница с карточками разделов, счётчиком звёзд, колокольчиком сообщений и блоком `Щоденний виклик`
- `app/games/page.tsx` — одна общая страница со всеми играми
- `app/leaderboard/page.tsx` — рейтинг пользователей
- `app/profile/page.tsx` — профиль пользователя
- `app/login/page.tsx` — вход через Supabase Auth
- `app/math/page.tsx` — раздел математики
- `app/dutch/page.tsx` — раздел нидерландского
- `app/ukrainian/page.tsx` — раздел украинского

## Игры по разделам

### Математика

- `app/math/pair-game/page.tsx`
- `app/math/pair-game/play/page.tsx` — `Знайди пару`
- `app/math/connect-pairs/page.tsx`
- `app/math/connect-pairs/[level]/page.tsx` — `З'єднай пару`
- `app/math/balance-scale/page.tsx`
- `app/math/balance-scale/[level]/page.tsx` — `Ваги рівноваги`
- `app/math/balloon-sweeper/page.tsx`
- `app/math/balloon-sweeper/[difficulty]/page.tsx` — `Кульковий сапер`
- `app/math/gravity-slingshot/page.tsx`
- `app/math/gravity-slingshot/[level]/page.tsx`
- `app/math/gravity-slingshot/[level]/GravityGameClient.tsx` — живая client-логика `Орбітальна арифметика`

### Нидерландский

- `app/dutch/connect-pairs/page.tsx`
- `app/dutch/connect-pairs/[level]/page.tsx` — `З'єднай слова`
- `app/dutch/wordle/page.tsx`
- `app/dutch/wordle/levels/page.tsx`
- `app/dutch/wordle/level/[level]/page.tsx` — Dutch Wordle

### Украинский

- `app/ukrainian/write-word/page.tsx`
- `app/ukrainian/write-word/levels/page.tsx`
- `app/ukrainian/write-word/level/[level]/page.tsx` — `Напиши слово`

## Ключевые компоненты

### Навигация и layout

- `src/components/layout/BottomNav.tsx` — нижнее меню `Головна / Ігри / Leaderboard / Профіль`
- `src/components/layout/SectionCard.tsx` — карточки разделов на главной
- `src/components/layout/PageHeader.tsx` — общий header для игровых страниц
- `src/components/GameEndModal.tsx` — единое завершение игры и переходы дальше

### Игровые компоненты

- `components/MathConnectPairsGame.tsx` — математика `З'єднай пару`
- `components/DutchConnectPairsGame.tsx` — нидерландский `З'єднай слова`
- `src/components/games/BalanceScale/BalanceScaleGame.tsx` — `Ваги рівноваги`
- `src/components/games/BalloonSweeper/BalloonSweeperGame.tsx` — `Кульковий сапер`
- `src/components/games/FindPair/FindPairGame.tsx` — `Знайди пару`
- `src/components/games/DutchWordle/DutchWordle.tsx` — Dutch Wordle
- `src/components/ui/Joystick.tsx` — джойстик для `Орбітальна арифметика`

## Ключевые библиотеки

### Прогресс и XP

- `src/lib/points.ts`
  - единая точка сохранения результата игры через `saveGameResult(...)`
  - надёжная запись XP в `game_progress` через `insert` или `update`
  - запуск обновления daily challenge после успешного сохранения

### Daily Challenge

- `src/lib/dailyChallenge.ts`
  - хранение серии в Supabase таблице `daily_challenge_progress`
  - правило: 1 день засчитывается, если завершена хотя бы 1 игра
  - 1 звезда за каждые 5 дней подряд

### Daily Messages

- `src/data/dailyMessages.ts` — 20 сообщений-головоломок
- `src/lib/dailyMessages.ts`
  - выбирает одно сообщение на день по порядку
  - хранит статус `прочитано` для пользователя или гостя
  - управляет красной точкой у колокольчика на главной

### Leaderboard

- `src/lib/leaderboard.ts`
  - читает агрегированные данные из `leaderboard_stats`
  - подготавливает XP, уровень и прогресс внутри уровня
  - сортирует пользователей по звёздам и XP

### Озвучка

- `src/lib/speech.ts`
  - общий helper для озвучки
  - только `uk` и `nl`, без fallback на русский
  - используется в `MathConnectPairsGame`, `DutchConnectPairsGame`, `Напиши слово`

### Игровые helpers

- `src/lib/balanceScale.ts` — генератор раундов для весов; внизу не показывает гирю с тем же числом, что слева
- `src/lib/gravityGame.ts` — уровни, стартовые позиции и адаптация поля `Орбітальна арифметика`
- `src/data/gravityGameLevels.ts` — данные уровней орбитальной арифметики

## Supabase-слой

### Таблицы

- `profiles` — имя и аватар пользователя
- `game_progress` — XP по категориям `math`, `dutch`, `ukrainian`
- `daily_challenge_progress` — серия дней, дата последнего выполнения и звёзды

### View

- `leaderboard_stats`
  - объединяет `profiles`
  - суммирует XP из `game_progress`
  - подтягивает звёзды из `daily_challenge_progress`

## Важные потоки данных

### Завершение игры

1. Игра завершается успешно.
2. Вызывается `saveGameResult(userId, category, 10, false)`.
3. XP сохраняется в `game_progress`.
4. `dailyChallenge` отмечает выполнение дня.
5. Главная страница и leaderboard получают обновлённые значения.

### Главная страница

1. Читает профиль пользователя.
2. Читает XP по категориям.
3. Читает звёзды и прогресс daily challenge.
4. Читает сообщение дня и статус прочтения.
5. Показывает звезду сверху и индикатор у колокольчика.

### Орбітальна арифметика

1. Поле зависит от фактического `canvasSize`.
2. Для телефона используется компактное поле и отдельные стартовые позиции.
3. `GravityGameClient` пересоздаёт уровень при смене размера канваса.
4. Звуки работают через Web Audio API и могут отключаться кнопкой рядом с джойстиком.

## Актуальные маршруты

- `/` — главная
- `/games` — все игры на одной странице
- `/leaderboard` — рейтинг
- `/profile` — профиль
- `/login` — вход
- `/math` — математика
- `/dutch` — нидерландский
- `/ukrainian` — украинский

## Примечания

- Daily challenge и leaderboard требуют выполненных SQL-файлов:
  - `database-setup.sql`
  - `daily-challenge-setup.sql`
  - `leaderboard-setup.sql`
- Для новых игр нужно использовать `saveGameResult(...)`, а не собственную схему XP.
- `BalanceScaleGame` уже защищён от hydration mismatch: раунд создаётся после монтирования на клиенте.
