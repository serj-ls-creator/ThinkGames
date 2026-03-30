export const DUTCH_GUESS_WORDS = [
  // Уровень 1 - простые слова (3-4 буквы)
  {
    level: 1,
    words: [
      { word: 'kat', translation: 'кот', hint: 'Домашнее животное, мяукает' },
      { word: 'hond', translation: 'собака', hint: 'Лучший друг человека' },
      { word: 'boom', translation: 'дерево', hint: 'Растет в лесу' },
      { word: 'water', translation: 'вода', hint: 'Пьём каждый день' },
      { word: 'brood', translation: 'хлеб', hint: 'Едим на завтрак' },
      { word: 'melk', translation: 'молоко', hint: 'Белая жидкость от коровы' },
      { word: 'boek', translation: 'книга', hint: 'Читаем для знаний' },
      { word: 'stoel', translation: 'стул', hint: 'На чём сидят' },
      { word: 'deur', translation: 'дверь', hint: 'Входим и выходим' },
      { word: 'raam', translation: 'окно', hint: 'Смотрим на улицу' }
    ]
  },
  // Уровень 2 - средние слова (4-5 букв)
  {
    level: 2,
    words: [
      { word: 'huis', translation: 'дом', hint: 'Где мы живем' },
      { word: 'tafel', translation: 'стол', hint: 'За чем едим' },
      { word: 'appel', translation: 'яблоко', hint: 'Фрукт, красное или зелёное' },
      { word: 'school', translation: 'школа', hint: 'Учимся здесь' },
      { word: 'fiets', translation: 'велосипед', hint: 'Два колеса и руль' },
      { word: 'auto', translation: 'машина', hint: 'Ездим по дороге' },
      { word: 'bloem', translation: 'цветок', hint: 'Красивое растение' },
      { word: 'zon', translation: 'солнце', hint: 'Светит днём' },
      { word: 'maan', translation: 'луна', hint: 'Светит ночью' },
      { word: 'ster', translation: 'звезда', hint: 'Светит в небе' }
    ]
  },
  // Уровень 3 - сложные слова (5-6 букв)
  {
    level: 3,
    words: [
      { word: 'computer', translation: 'компьютер', hint: 'Работаем и играем' },
      { word: 'telefoon', translation: 'телефон', hint: 'Звоним и пишем сообщения' },
      { word: 'kamer', translation: 'комната', hint: 'Часть дома' },
      { word: 'familie', translation: 'семья', hint: 'Близкие люди' },
      { word: 'vriend', translation: 'друг', hint: 'Хороший знакомый' },
      { word: 'wereld', translation: 'мир', hint: 'Планета Земля' },
      { word: 'morgen', translation: 'утро', hint: 'Начало дня' },
      { word: 'avond', translation: 'вечер', hint: 'Конец дня' },
      { word: 'geel', translation: 'жёлтый', hint: 'Цвет солнца' },
      { word: 'groen', translation: 'зелёный', hint: 'Цвет травы' }
    ]
  },
  // Уровень 4 - очень сложные слова (6+ букв)
  {
    level: 4,
    words: [
      { word: 'Nederland', translation: 'Нидерланды', hint: 'Страна тюльпанов' },
      { word: 'Amsterdam', translation: 'Амстердам', hint: 'Столица Нидерландов' },
      { word: 'universiteit', translation: 'университет', hint: 'Высшее учебное заведение' },
      { word: 'restaurant', translation: 'ресторан', hint: 'Место где едят' },
      { word: 'bibliotheek', translation: 'библиотека', hint: 'Место с книгами' },
      { word: 'wiskunde', translation: 'математика', hint: 'Школьный предмет с цифрами' },
      { word: 'geschiedenis', translation: 'история', hint: 'Изучаем прошлое' },
      { word: 'aardappelen', translation: 'картофель', hint: 'Овощ, растущий в земле' },
      { word: 'chocolade', translation: 'шоколад', hint: 'Сладость из какао' },
      { word: 'verjaardag', translation: 'день рождения', hint: 'Праздник раз в году' }
    ]
  }
];

// Функция для получения случайного слова для уровня
export const getRandomDutchWord = (level: number) => {
  const levelData = DUTCH_GUESS_WORDS.find(l => l.level === level);
  if (!levelData || levelData.words.length === 0) {
    return { word: 'huis', translation: 'дом', hint: 'Где мы живем' }; // Fallback
  }
  
  const randomIndex = Math.floor(Math.random() * levelData.words.length);
  return levelData.words[randomIndex];
};

// Функция для получения всех слов уровня
export const getDutchWordsByLevel = (level: number) => {
  const levelData = DUTCH_GUESS_WORDS.find(l => l.level === level);
  return levelData ? levelData.words : [];
};
