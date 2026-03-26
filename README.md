# ThinkGames

Освітній додаток для дітей 8-12 років для вивчення математики через ігри.

## Технології

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Framer Motion (animations)
- Supabase (database)

## Встановлення

1. Клонуйте репозиторій
2. Встановіть залежності:
```bash
npm install
```

3. Налаштуйте Supabase:
   - Створіть новий проект в [Supabase](https://supabase.com)
   - Перейдіть до SQL Editor та виконайте наступний SQL для створення таблиці:

```sql
CREATE TABLE game_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  level INTEGER NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Створіть індекс для швидкого пошуку
CREATE INDEX idx_game_progress_session_id ON game_progress(session_id);
```

4. Отримайте URL та anon ключ з налаштувань Supabase проекту (Settings > API)
5. Створіть файл `.env.local` та додайте ваші дані:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Запуск

```bash
npm run dev
```

Відкрийте [http://localhost:3000](http://localhost:3000) у браузері.

## Структура проекту

```
/app
  page.tsx              # Головна сторінка
  /math
    page.tsx           # Сторінка вибору рівня
    /pair-game
      page.tsx         # Сторінка гри
/components
  Card.tsx             # Компонент картки
  GameGrid.tsx         # Сітка гри
  Header.tsx           # Заголовок
  LevelSelector.tsx    # Вибір рівня
/store
  useGameStore.ts      # Zustand store
/lib
  generatePairs.ts     # Генерація пар для гри
  supabaseClient.ts    # Supabase клієнт
  utils.ts             # Утиліти
```

## Гра "Знайди пару"

### Правила гри
- Гравець повинен знайти пари карток (приклад × відповідь)
- Клікніть на картку щоб перевернути її
- Знайдіть всі 6 пар для завершення гри
- Результат залежить від кількості ходів

### Рівні складності
- **До 20**: Легкий рівень (малі числа)
- **До 50**: Середній рівень 
- **До 100**: Складний рівень

## Деплоймент

Проект готовий до деплойменту на Vercel.

1. Підключіть ваш репозиторій до Vercel
2. Додайте змінні середовища в налаштуваннях Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Ліцензія

MIT
