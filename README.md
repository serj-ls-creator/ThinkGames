# ThinkGames

🎮 Образовательная игровая платформа для изучения математики, голландского и украинского языков.

## 📋 Описание

ThinkGames - это веб-приложение для детей 8-12 лет, которое делает обучение увлекательным через интерактивные игры. Платформа включает различные типы игр для изучения математики и иностранных языков.

## 🛠️ Технологический стек

- **Frontend:** Next.js 14 (App Router)
- **Язык:** TypeScript
- **Стили:** Tailwind CSS
- **Анимации:** Framer Motion
- **Состояние:** Zustand
- **База данных:** Supabase
- **Деплой:** Vercel (рекомендуется)

## 📁 Структура проекта

```
ThinkGames/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Главная страница
│   ├── math/                     # Раздел математики
│   │   ├── page.tsx              # Страница раздела
│   │   ├── find-pair/            # Игра "Найди пару"
│   │   │   ├── page.tsx          # Выбор уровня
│   │   │   └── [level]/page.tsx  # Игра
│   │   └── connect-pair/          # Игра "Соедини пару"
│   ├── dutch/                    # Раздел голландского
│   │   ├── page.tsx              # Страница раздела
│   │   ├── words/                # Игра "Слова"
│   │   ├── connect-words/        # Игра "Соедини слова"
│   │   └── write-word/           # Игра "Напиши слово"
│   └── ukrainian/                # Раздел украинского
│       └── page.tsx              # Страница раздела
├── src/
│   ├── components/               # Реиспользуемые компоненты
│   │   ├── layout/              # Layout компоненты
│   │   ├── games/               # Игровые компоненты
│   │   └── ui/                  # UI компоненты
│   ├── types/                   # TypeScript типы
│   ├── constants/               # Константы приложения
│   ├── lib/                     # Утилиты и функции
│   ├── store/                   # Zustand store
│   └── data/                    # Статические данные
├── public/                      # Статические файлы
└── .env.example                 # Пример переменных окружения
```

## 🚀 Быстрый старт

### 1. Клонирование и установка

```bash
git clone <repository-url>
cd ThinkGames
npm install
```

### 2. Настройка Supabase

1. Создайте новый проект в [Supabase](https://supabase.com)
2. Скопируйте URL и anon ключ
3. Создайте файл `.env.local` на основе `.env.example`
4. Добавьте свои переменные окружения

```bash
cp .env.example .env.local
```

### 3. Создание таблиц в Supabase

Выполните SQL в Supabase Dashboard:

```sql
-- Таблица результатов игр
CREATE TABLE game_results (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL,
  game text NOT NULL,
  section text NOT NULL,
  level integer NOT NULL,
  score integer NOT NULL,
  time_seconds integer NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Таблица прогресса пользователя
CREATE TABLE user_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL,
  section text NOT NULL,
  game text NOT NULL,
  level integer NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Включение RLS
ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Политики для анонимных пользователей
CREATE POLICY "Allow anonymous game_results" ON game_results
  FOR ALL USING (auth.role() = 'anon');

CREATE POLICY "Allow anonymous user_progress" ON user_progress
  FOR ALL USING (auth.role() = 'anon');
```

### 4. Запуск приложения

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## 🎮 Разделы и игры

### 🧮 Математика

1. **Знайди пару** - игра на запоминание с карточками умножения
   - Уровни сложности: до 20, до 50, до 100
   - Размеры поля: 3×4, 4×4, 3×6
   - Исключены примеры с умножением на 1

2. **З'єднай пару** - игра на соединение примеров с ответами
   - 10 уровней (таблицы умножения 2-10 + смешанные)
   - Две колонки с перетаскиванием

### 🇳🇱 Нідерландська мова

1. **Слова** - изучение базовых слов
2. **З'єднай слова** - соединение голландских слов с переводами
   - 10 уровней по 10 слов каждый
   - Темы: дом, школа, семья, животные, цвета, числа, еда, одежда, погода, время

3. **Напиши слово** - (в разработке)

### 📖 Українська мова

- Раздел в разработке

## 🎯 Игровые механики

- **Прогресс:** отслеживание прогресса по уровням
- **Очки:** система подсчета очков с учетом сложности
- **Анимации:** плавные переходы и микро-взаимодействия
- **Адаптивность:** мобильный-first дизайн
- **Сохранение:** автоматическое сохранение результатов в Supabase

## 🛠️ Разработка

### Добавление новой игры

1. Создайте компонент игры в `src/components/games/`
2. Добавьте маршруты в `app/[section]/[game]/`
3. Обновите константы в `src/constants/index.ts`
4. Добавьте типы в `src/types/index.ts`

### Структура компонента игры

```typescript
// src/components/games/NewGame/NewGameGame.tsx
import { GameLevel } from '../../types'

interface NewGameGameProps {
  level: GameLevel
  onLevelComplete: (score: number) => void
}

export const NewGameGame: React.FC<NewGameGameProps> = ({
  level,
  onLevelComplete
}) => {
  // Логика игры
}
```

## 📦 Сборка и деплой

### Локальная сборка

```bash
npm run build
npm start
```

### Деплой на Vercel

1. Подключите репозиторий к [Vercel](https://vercel.com)
2. Добавьте переменные окружения в Vercel Dashboard
3. Разверните приложение

## 🤝 Вклад

1. Fork проекта
2. Создайте_feature ветку
3. Внесите изменения
4. Отправьте Pull Request

## 📄 Лицензия

MIT License

## 🙏 Благодарности

- [Next.js](https://nextjs.org/) - React фреймворк
- [Tailwind CSS](https://tailwindcss.com/) - CSS фреймворк
- [Supabase](https://supabase.com/) - Backend as a Service
- [Framer Motion](https://www.framer.com/motion/) - библиотека анимаций
- [Zustand](https://github.com/pmndrs/zustand) - управление состоянием
