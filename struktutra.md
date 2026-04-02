# Структура проекта ThinkGames

## Общая структура

```text
ThinkGames/
├── app/                         # Страницы Next.js App Router
├── components/                  # Старые и переиспользуемые игровые компоненты
├── data/                        # Игровые данные
├── lib/                         # Вспомогательные утилиты верхнего уровня
├── public/                      # Статические ресурсы
├── src/
│   ├── components/              # Основные UI и игровые компоненты
│   ├── constants/               # Константы и маршруты
│   ├── context/                 # AuthContext
│   ├── data/                    # Данные для игр
│   ├── lib/                     # Работа с Supabase, очками, leaderboard, profile
│   └── types/                   # Общие типы проекта
├── store/                       # Zustand store
├── cleanup_duplicates.sql       # Очистка дублей в game_progress
├── daily-challenge-setup.sql    # SQL для daily_challenge_progress
├── database-setup.sql           # SQL для profiles и триггера создания профиля
├── leaderboard-setup.sql        # SQL view leaderboard_stats
├── promt_games.md               # Правила разработки игр
├── status.md                    # Текущий статус проекта
└── struktutra.md                # Этот файл
```

## app/

### Основные страницы

- `app/page.tsx` — главная страница с карточками предметов, верхним счетчиком звезд и блоком "Щоденний виклик"
- `app/leaderboard/page.tsx` — экран рейтинга пользователей
- `app/login/page.tsx` — вход через Supabase Auth
- `app/profile/page.tsx` — профиль пользователя
- `app/layout.tsx` — корневой layout и `AuthProvider`

### Математика

- `app/math/page.tsx` — выбор математических игр
- `app/math/pair-game/play/page.tsx` — игра "Знайди пару"
- `app/math/connect-pairs/page.tsx` — выбор уровней "З'єднай пару"
- `app/math/connect-pairs/[level]/page.tsx` — игра "З'єднай пару"
- `app/math/balance-scale/page.tsx` — выбор уровней "Ваги рівноваги"
- `app/math/balance-scale/[level]/page.tsx` — игра "Ваги рівноваги"
- `app/math/balloon-sweeper/page.tsx` — выбор сложности "Кульковий сапер"
- `app/math/balloon-sweeper/[difficulty]/page.tsx` — игра "Кульковий сапер"

### Нидерландский

- `app/dutch/page.tsx` — выбор игр раздела
- `app/dutch/connect-pairs/page.tsx` — выбор уровней
- `app/dutch/connect-pairs/[level]/page.tsx` — игра на соединение слов
- `app/dutch/wordle/levels/page.tsx` — выбор уровней DutchWordle
- `app/dutch/wordle/level/[level]/page.tsx` — DutchWordle

### Украинский

- `app/ukrainian/page.tsx` — выбор игр раздела
- `app/ukrainian/write-word/levels/page.tsx` — выбор уровней
- `app/ukrainian/write-word/level/[level]/page.tsx` — игра "Напиши слово"

## src/components/

### Layout и UI

- `src/components/layout/BottomNav.tsx` — нижнее меню: Главная, Игры, Leaderboard, Профиль
- `src/components/layout/SectionCard.tsx` — карточка предмета на главной
- `src/components/ui/ProgressBar.tsx` — прогресс-бар
- `src/components/GameEndModal.tsx` — универсальное модальное окно завершения игры

### Игры

- `src/components/games/FindPair/FindPairGame.tsx`
- `src/components/games/BalanceScale/BalanceScaleGame.tsx`
- `src/components/games/BalloonSweeper/BalloonSweeperGame.tsx`
- `src/components/games/DutchWordle/DutchWordle.tsx`
- `components/MathConnectPairsGame.tsx`
- `components/DutchConnectPairsGame.tsx`

## src/lib/

### Прогресс и XP

- `src/lib/points.ts`
  - хранение XP по категориям в `game_progress`
  - `saveGameResult(...)` — общая точка сохранения результата игры
  - после успешного сохранения XP запускает обновление daily challenge

### Daily Challenge

- `src/lib/dailyChallenge.ts`
  - чтение состояния из `daily_challenge_progress`
  - логика серии "1 игра в день"
  - начисление 1 звезды за 5 дней подряд

### Leaderboard

- `src/lib/leaderboard.ts`
  - загрузка данных из view `leaderboard_stats`
  - расчет уровня и прогресса внутри уровня на клиенте

### Профиль и Auth

- `src/lib/profile-db.ts` — чтение и обновление `profiles`
- `src/lib/supabase.ts` — инициализация Supabase client
- `src/context/AuthContext.tsx` — работа с текущим пользователем

## SQL-слой Supabase

### Таблицы

- `profiles` — имя и аватар пользователя
- `game_progress` — XP по категориям `math`, `ukrainian`, `dutch`
- `daily_challenge_progress` — звезды, дни серии, последняя дата выполнения

### View

- `leaderboard_stats`
  - объединяет `profiles`
  - суммирует XP из `game_progress`
  - подтягивает звезды из `daily_challenge_progress`

## Потоки данных

### Завершение игры

1. Игра завершилась успешно
2. Вызывается `saveGameResult(user.id, category, 10, false)`
3. В `game_progress` обновляется XP пользователя
4. В `daily_challenge_progress` отмечается текущий день
5. На главной странице и в leaderboard отображаются обновленные данные

### Главная страница

1. Загружает профиль пользователя
2. Загружает XP-статистику из `game_progress`
3. Загружает состояние daily challenge из `daily_challenge_progress`
4. Показывает звезды в верхней части экрана и прогресс серии 0/5 ... 5/5

### Leaderboard

1. Читает `leaderboard_stats`
2. Сортирует пользователей по `stars DESC`, затем по `total_xp DESC`
3. Показывает аватар, имя, общий XP, уровень и звезды

## Актуальные маршруты

- `/` — главная
- `/leaderboard` — рейтинг
- `/profile` — профиль
- `/login` — вход
- `/math` — математика
- `/dutch` — нидерландский
- `/ukrainian` — украинский

## Примечания

- Гости могут играть, но Supabase-статистика и daily challenge рассчитаны на авторизованных пользователей
- Для корректной работы daily challenge и leaderboard в Supabase должны быть выполнены:
  - `database-setup.sql`
  - `daily-challenge-setup.sql`
  - `leaderboard-setup.sql`
