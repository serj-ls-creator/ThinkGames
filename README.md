# ThinkGames

ThinkGames — образовательная игровая платформа для детей, где математика, нидерландский и украинский язык изучаются через короткие интерактивные игры.

## Что есть в проекте

- главная страница с карточками разделов
- общий XP и уровни
- `Щоденний виклик` со звёздами
- ежедневные сообщения-головоломки в колокольчике
- `Leaderboard`
- профиль пользователя
- единая страница `/games` со всеми играми
- хранение данных в Supabase

## Основные механики

### XP и уровни

- каждая завершённая игра даёт `10 XP`
- XP хранится в `game_progress`
- категории прогресса:
  - `math`
  - `dutch`
  - `ukrainian`
- `500 XP = 1 уровень`

### Щоденний виклик

- день засчитывается, если пользователь прошёл хотя бы 1 игру за день
- за каждые 5 дней подряд начисляется `1 звезда`
- прогресс хранится в `daily_challenge_progress`
- звёзды показываются в верхней части главной страницы

### Daily messages

- в колокольчике на главной показывается одно сообщение в день
- сообщения идут по порядку из отдельного списка
- после просмотра сообщение считается прочитанным, и красная точка исчезает

### Leaderboard

- маршрут: `/leaderboard`
- показывает:
  - аватар
  - имя
  - общий XP
  - уровень
  - прогресс внутри уровня
  - количество звёзд
- сортировка идёт по звёздам, затем по XP

## Игры

### Математика

- `Знайди пару`
- `З'єднай пару`
- `Ваги рівноваги`
- `Кульковий сапер`
- `Орбітальна арифметика`

### Нидерландский

- `З'єднай слова`
- `Вгадай слово`

### Украинский

- `Напиши слово`

## Озвучка

- используется общий helper `src/lib/speech.ts`
- поддерживаются только правильные языки озвучки
- русский язык исключён из fallback
- `Math Connect Pairs` и `Dutch Connect Pairs`:
  - левая колонка — нидерландская
  - правая колонка — украинская
- `Українська -> Напиши слово` озвучивает слово на украинском

## Орбітальна арифметика

- реализована на `app/math/gravity-slingshot/[level]/GravityGameClient.tsx`
- использует Web Audio API для игровых звуков
- есть кнопка включения и отключения звука
- поле адаптируется под телефон
- уровень пересоздаётся под реальный размер `canvas`

## Важные файлы

### Маршруты и UI

- `app/page.tsx` — главная
- `app/games/page.tsx` — все игры на одной странице
- `app/leaderboard/page.tsx` — leaderboard
- `src/components/layout/BottomNav.tsx` — нижняя навигация
- `src/components/GameEndModal.tsx` — завершение игр

### Прогресс и данные

- `src/lib/points.ts` — сохранение XP и вызов daily challenge
- `src/lib/dailyChallenge.ts` — логика ежедневного вызова
- `src/lib/dailyMessages.ts` — сообщение дня и статус прочтения
- `src/lib/leaderboard.ts` — загрузка рейтинга
- `src/lib/profile-db.ts` — профиль пользователя
- `src/lib/supabase.ts` — Supabase client

### Игровая логика

- `src/components/games/BalanceScale/BalanceScaleGame.tsx`
- `src/lib/balanceScale.ts`
- `src/lib/gravityGame.ts`
- `components/MathConnectPairsGame.tsx`
- `components/DutchConnectPairsGame.tsx`

## Структура проекта

```text
ThinkGames/
├── app/
├── components/
├── public/
├── src/
│   ├── components/
│   ├── constants/
│   ├── context/
│   ├── data/
│   ├── lib/
│   ├── store/
│   └── types/
├── database-setup.sql
├── daily-challenge-setup.sql
├── leaderboard-setup.sql
├── README.md
├── status.md
├── struktutra.md
└── promt_games.md
```

## Быстрый старт

### 1. Установка

```bash
npm install
```

### 2. Переменные окружения

Создайте `.env.local` и заполните Supabase-переменные проекта.

### 3. Настройка Supabase

Выполните SQL-файлы в таком порядке:

1. `database-setup.sql`
2. `daily-challenge-setup.sql`
3. `leaderboard-setup.sql`

Это подготовит:

- `profiles`
- `daily_challenge_progress`
- `leaderboard_stats`

`game_progress` должен быть доступен для хранения XP.

### 4. Запуск

```bash
npm run dev
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000).

## Навигация

- `/` — главная
- `/games` — все игры
- `/leaderboard` — рейтинг
- `/profile` — профиль
- `/login` — вход
- `/math` — математика
- `/dutch` — нидерландский
- `/ukrainian` — украинский

## Правила для новых игр

Новая игра должна:

- использовать `GameEndModal`
- сохранять результат через `saveGameResult(...)`
- начислять фиксированные `10 XP`
- не дублировать логику daily challenge
- не добавлять отдельный обходной механизм leaderboard

Подробные правила описаны в [promt_games.md](/D:/app/_in_dev_windsurf/ThinkGames/promt_games.md).

## Документация проекта

- [status.md](/D:/app/_in_dev_windsurf/ThinkGames/status.md)
- [struktutra.md](/D:/app/_in_dev_windsurf/ThinkGames/struktutra.md)
- [promt_games.md](/D:/app/_in_dev_windsurf/ThinkGames/promt_games.md)

## Проверка

```bash
npx tsc --noEmit
```
