# Структура проекта ThinkGames

## 📁 Общая структура

```
ThinkGames/
├── app/                          # Next.js App Router страницы
├── src/                          # Исходный код компонентов и утилит
├── components/                   # Переиспользуемые компоненты
├── data/                         # Данные для игр
├── lib/                          # Утилиты и функции
├── store/                        # Zustand store
├── status.md                     # Статус проекта
├── promt_games.md               # Правила разработки игр
├── struktutra.md                # Этот файл
└── README.md                     # Документация проекта
```

## 📂 Детальная структура файлов

### 🏠 app/ - Страницы Next.js

#### Главная страница
- **`app/page.tsx`** - Главная страница с карточками предметов

#### Математические игры
- **`app/math/page.tsx`** - Выбор математических игр
- **`app/math/pair-game/`** - Игра "Знайди пару"
  - `page.tsx` - Выбор уровней сложности
  - `play/page.tsx` - Игровой процесс с GameEndModal
- **`app/math/connect-pairs/`** - Игра "З'єднай пару" (таблица умножения)
  - `page.tsx` - Выбор уровней
  - `[level]/page.tsx` - Игровой процесс с MathConnectPairsGame
- **`app/math/balance-scale/`** - Игра "Ваги рівноваги"
  - `page.tsx` - Выбор уровней
  - `[maxValue]/page.tsx` - Игровой процесс с BalanceScaleGame
- **`app/math/balloon-sweeper/`** - Игра "Кульковий сапер"
  - `page.tsx` - Выбор сложности
  - `[difficulty]/page.tsx` - Игровой процесс с BalloonSweeperGame

#### Нидерландские игры
- **`app/dutch/page.tsx`** - Выбор нидерландских игр
- **`app/dutch/connect-pairs/`** - Игра "З'єднай слова"
  - `page.tsx` - Выбор уровней
  - `[level]/page.tsx` - Игровой процесс с DutchConnectPairsGame
- **`app/dutch/wordle/`** - Игра DutchWordle
  - `page.tsx` - Выбор уровней
  - `[level]/page.tsx` - Игровой процесс с DutchWordle

#### Украинские игры
- **`app/ukrainian/page.tsx`** - Выбор украинских игр
- **`app/ukrainian/write-word/`** - Игра "Напиши слово"
  - `page.tsx` - Перенаправление на уровни
  - `levels/page.tsx` - Выбор уровней
  - `level/[level]/page.tsx` - Игровой процесс с GameEndModal

#### Аутентификация и профиль
- **`app/login/page.tsx`** - Страница входа
- **`app/profile/page.tsx`** - Профиль пользователя

### 🧩 src/ - Основные компоненты

#### Игровые компоненты
- **`src/components/games/BalanceScale/`** - Игра "Ваги рівноваги"
  - `BalanceScaleGame.tsx` - Основной компонент игры
  - `BalanceWeight.tsx` - Компонент весов
- **`src/components/games/BalloonSweeper/`** - Игра "Кульковий сапер"
  - `BalloonSweeperGame.tsx` - Основной компонент игры
- **`src/components/games/ConnectPair/`** - Игра "З'єднай пару" (старая версия)
  - `ConnectPairGame.tsx` - Основной компонент игры
- **`src/components/games/FindPair/`** - Игра "Знайди пару"
  - `FindPairGame.tsx` - Основной компонент игры
  - `Card.tsx` - Компонент карточки
  - `GameGrid.tsx` - Сетка карточек
- **`src/components/games/DutchWordle/`** - Игра DutchWordle
  - `DutchWordle.tsx` - Основной компонент игры

#### Универсальные компоненты
- **`src/components/GameEndModal.tsx`** - **Универсальное модальное окно для всех игр**
  - 3 кнопки: Повторить → Назад к рівням → В головне меню
  - Гибкая конфигурация через пропсы
  - Автоматическая подстройка под каждую игру

#### UI компоненты
- **`src/components/Header.tsx`** - Шапка сайта
- **`src/components/LevelSelector.tsx`** - Выбор уровней
- **`src/components/LevelSelectorCompact.tsx`** - Компактный выбор уровней
- **`src/components/GameGrid.tsx`** - Универсальная сетка для игр

### 🔧 components/ - Переиспользуемые компоненты

#### Разделенные игровые компоненты
- **`components/DutchConnectPairsGame.tsx`** - Игра "З'єднай слова" (нидерландская)
  - Использует GameEndModal с правильными ссылками на /dutch
- **`components/MathConnectPairsGame.tsx`** - Игра "З'єднай пару" (математика)
  - Использует GameEndModal с правильными ссылками на /math
- **`components/ConnectPairsGame.tsx`** - **Старый общий компонент** (не используется)

#### Другие компоненты
- **`components/GameGrid.tsx`** - Сетка для игр типа "найди пару"

### 📊 data/ - Данные для игр

#### Игровые данные
- **`data/math-pairs.ts`** - Пары для математической игры "З'єднай пару"
- **`data/dutch-words.ts`** - Нидерландские слова для игры "З'єднай слова"
- **`data/math-pairs.ts`** - Математические пары для таблицы умножения

#### Константы
- **`src/constants/ukrainianWords.ts`** - Украинские слова для игры "Напиши слово"
- **`src/constants/dutchGuessWords.ts`** - Слова для DutchWordle
- **`src/data/dutchWords.ts`** - Данные нидерландских слов

### 🛠️ lib/ - Утилиты и функции

#### Игровая логика
- **`src/lib/balanceScale.ts`** - Логика игры "Ваги рівноваги"
  - `BALANCE_LEVELS` - Уровни сложности
  - `generateBalanceRound` - Генерация раундов
  - `BalanceWeight` - Тип весов
- **`src/lib/balloonSweeper.ts`** - Логика игры "Кульковий сапер"
  - `BALLOON_LEVELS` - Уровни сложности
  - `generateBoard` - Генерация поля
  - `BalloonCell` - Тип клетки
- **`src/lib/generatePairs.ts`** - Генерация пар для игр
  - `generateMathPairs` - Математические пары
  - `generateDutchPairs` - Нидерландские пары
  - `calculateScore` - **Устаревшая функция** (не используется)

#### Система очков
- **`src/lib/points.ts`** - Сохранение очков в Supabase
  - `saveGameResult` - Основная функция сохранения

#### Утилиты
- **`src/lib/utils.ts`** - Общие утилиты
  - `getSessionId` - Получение ID сессии
- **`lib/testUniquePairs.ts`** - Тестирование уникальности пар

### 🗄️ store/ - Управление состоянием

- **`store/useGameStore.ts`** - Zustand store для игры "Знайди пару"
  - Состояние карточек, ходов, прогресса
  - Функции инициализации и сброса

### 🔐 Аутентификация

- **`src/context/AuthContext.tsx`** - Контекст аутентификации Supabase
- **`src/context/AuthContext.ts`** - Типы для аутентификации

### 📝 Типы

- **`src/types/index.ts`** - Общие типы проекта
  - `WordPair` - Тип для пар слов
  - Другие игровые типы

### 📋 Документация

- **`status.md`** - Текущий статус реализации проекта
- **`promt_games.md`** - Правила разработки игр с GameEndModal
- **`struktutra.md`** - Этот файл (структура проекта)
- **`README.md`** - Основная документация

## 🎮 Игровые компоненты и их использование

### ✅ Компоненты с GameEndModal (универсальное модальное окно)

1. **BalanceScaleGame** (`src/components/games/BalanceScale/BalanceScaleGame.tsx`)
   - Ссылки: `/math/balance-scale`, `/math`
   - Кнопки: "Далі" → "Назад к рівням" → "В головне меню"

2. **BalloonSweeperGame** (`src/components/games/BalloonSweeper/BalloonSweeperGame.tsx`)
   - Ссылки: `/math/balloon-sweeper`, `/math`
   - Кнопки: "Почати знову" → "Назад к рівням" → "В головне меню"

3. **FindPairGame** (`src/components/games/FindPair/FindPairGame.tsx`)
   - Ссылки: `/math/find-pair`, `/math`
   - Кнопки: "Грати знову" → "Назад к рівням" → "В головне меню"

4. **DutchWordle** (`src/components/games/DutchWordle/DutchWordle.tsx`)
   - Ссылки: `/dutch/wordle/levels`, `/dutch`
   - Кнопки: "Ще раз" → "Назад к рівням" → "В головне меню"

5. **DutchConnectPairsGame** (`components/DutchConnectPairsGame.tsx`)
   - Ссылки: `/dutch/connect-pairs`, `/dutch`
   - Кнопки: "Ще раз" → "Назад к рівням" → "В головне меню"

6. **MathConnectPairsGame** (`components/MathConnectPairsGame.tsx`)
   - Ссылки: `/math/connect-pairs`, `/math`
   - Кнопки: "Ще раз" → "Назад к рівням" → "В головне меню"

7. **"Знайди пару"** (`app/math/pair-game/play/page.tsx`)
   - Ссылки: `/math/pair-game`, `/math`
   - Кнопки: "Грати знову" → "Назад к рівням" → "В головне меню"

8. **"Напиши слово"** (`app/ukrainian/write-word/level/[level]/page.tsx`)
   - Ссылки: `/ukrainian/write-word/levels`, `/ukrainian`
   - Кнопки: "Повторити рівень" → "Назад к рівням" → "В головне меню"

### ❌ Компоненты без GameEndModal (устаревшие)

1. **ConnectPairGame** (`src/components/games/ConnectPair/ConnectPairGame.tsx`)
   - Старый компонент, не используется
   - Заменен на MathConnectPairsGame и DutchConnectPairsGame

### 🗑️ Удаленные игры

1. **"Орбітальна Арифметика" (Gravity Slingshot)**
   - Была: `app/math/gravity-slingshot/`
   - Удалена из проекта
   - Причина: Сложность реализации и проблемы с гидратацией

## 🔄 Потоки данных

### 🎮 Игровой цикл
1. **Инициализация игры** → Загрузка данных из `data/`
2. **Игровой процесс** → Обновление состояния в компонентах
3. **Завершение игры** → Показ GameEndModal
4. **Сохранение очков** → `saveGameResult` в Supabase
5. **Навигация** → Переход по ссылкам из GameEndModal

### 📊 Система очков
1. **Завершение игры** → useEffect срабатывает
2. **Проверка условий** → `hasSaved.current` защита
3. **Сохранение** → `saveGameResult(user.id, category, 10, false)`
4. **Логирование** → `console.log('!!! GAME COMPLETE: 10 XP SENT !!!')`

### 🎯 Категории игр
- **'math'** → `/math/*` маршруты
- **'dutch'** → `/dutch/*` маршруты  
- **'ukrainian'** → `/ukrainian/*` маршруты

## 🛠️ Технический стек

- **Framework**: Next.js 14 App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Animations**: Framer Motion
- **Database**: Supabase
- **Auth**: Supabase Auth
- **Speech**: Web Speech Synthesis API

---

**Эта структура обеспечивает консистентный UX и легкую поддержку всех игр!** 🎮✨
