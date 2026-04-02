# ThinkGames

ThinkGames — образовательная игровая платформа для детей, в которой изучение математики, нидерландского и украинского языков построено через короткие интерактивные игры.

## Что есть в проекте

- главная страница с карточками разделов
- общий прогресс по XP
- `Щоденний виклик` с начислением звезд
- `Leaderboard` с рейтингом пользователей
- профиль пользователя с именем и аватаром
- хранение данных в Supabase

## Основные механики

### XP

- каждая завершенная игра дает `10 XP`
- XP хранится в `game_progress`
- категории:
  - `math`
  - `ukrainian`
  - `dutch`
- 1 уровень = `500 XP`

### Щоденний виклик

- если пользователь проходит хотя бы 1 игру за день, день засчитывается
- за 5 дней подряд начисляется `1 звезда`
- состояние хранится в `daily_challenge_progress`
- звезды отображаются в верхней части главной страницы

### Leaderboard

- отдельный маршрут: `/leaderboard`
- показывает:
  - аватар
  - имя
  - общий XP
  - уровень
  - прогресс внутри уровня
  - количество звезд
- рейтинг строится по:
  1. количеству звезд
  2. общему XP

## Технологический стек

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand
- Supabase

## Структура проекта

```text
ThinkGames/
├── app/
│   ├── page.tsx
│   ├── leaderboard/page.tsx
│   ├── login/page.tsx
│   ├── profile/page.tsx
│   ├── math/
│   ├── dutch/
│   └── ukrainian/
├── src/
│   ├── components/
│   ├── constants/
│   ├── context/
│   ├── lib/
│   └── types/
├── components/
├── data/
├── public/
├── database-setup.sql
├── daily-challenge-setup.sql
├── leaderboard-setup.sql
├── struktutra.md
├── status.md
└── promt_games.md
```

## Важные файлы

### Frontend

- `app/page.tsx` — главная страница
- `app/leaderboard/page.tsx` — рейтинг пользователей
- `src/components/layout/BottomNav.tsx` — нижнее меню
- `src/components/GameEndModal.tsx` — общее модальное окно завершения игры

### Data layer

- `src/lib/points.ts` — сохранение XP
- `src/lib/dailyChallenge.ts` — логика daily challenge
- `src/lib/leaderboard.ts` — получение leaderboard
- `src/lib/profile-db.ts` — профиль пользователя
- `src/lib/supabase.ts` — Supabase client

### SQL

- `database-setup.sql` — profiles + trigger
- `daily-challenge-setup.sql` — таблица `daily_challenge_progress`
- `leaderboard-setup.sql` — view `leaderboard_stats`

## Быстрый старт

### 1. Установка

```bash
npm install
```

### 2. Переменные окружения

Создайте `.env.local` на основе `.env.example`.

Если в проекте используются переменные Supabase через env, заполните их своими значениями.

## 3. Настройка Supabase

Выполните SQL-файлы в таком порядке:

1. `database-setup.sql`
2. `daily-challenge-setup.sql`
3. `leaderboard-setup.sql`

Это создаст:

- таблицу `profiles`
- таблицу `daily_challenge_progress`
- view `leaderboard_stats`

Примечание: таблица `game_progress` уже должна существовать и использоваться для XP.

### 4. Запуск

```bash
npm run dev
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000).

## Разделы и игры

### Математика

- "Знайди пару"
- "З'єднай пару"
- "Ваги рівноваги"
- "Кульковий сапер"

### Нидерландский

- "З'єднай слова"
- DutchWordle

### Украинский

- "Напиши слово"

## Навигация

- `/` — главная
- `/leaderboard` — рейтинг
- `/profile` — профиль
- `/login` — вход
- `/math` — раздел математики
- `/dutch` — раздел нидерландского
- `/ukrainian` — раздел украинского

## Как добавлять новую игру

Новая игра должна:

- использовать `GameEndModal`
- сохранять результат через `saveGameResult(...)`
- начислять фиксированные `10 XP`
- не дублировать логику daily challenge
- не делать отдельную систему leaderboard

Подробные правила находятся в [promt_games.md](/D:/app/_in_dev_windsurf/ThinkGames/promt_games.md).

## Состояние проекта

Актуальные статусы и технические заметки:

- [status.md](/D:/app/_in_dev_windsurf/ThinkGames/status.md)
- [struktutra.md](/D:/app/_in_dev_windsurf/ThinkGames/struktutra.md)

## Проверка

Для проверки типов:

```bash
npx tsc --noEmit
```

## Деплой

Рекомендуемый вариант — Vercel + Supabase.

Для production нужно:

- задать переменные окружения
- подготовить таблицы и view в Supabase
- проверить доступы RLS и `grant select` для leaderboard

## Лицензия

MIT
