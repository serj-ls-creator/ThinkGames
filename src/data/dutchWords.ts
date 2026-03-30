// Нидерландские слова уровня A1 для игры Wordle
// Структура: { word: 'слово', hint: 'подсказка на украинском' }

export interface DutchWord {
  word: string;
  hint: string;
}

export const dutchWordsByLevel = {
  4: [
    { word: 'boek', hint: 'Те що читаємо для знань' },
    { word: 'huis', hint: 'Місце де ми живемо' },
    { word: 'melk', hint: 'Біла рідина від корови' },
    { word: 'kaas', hint: 'Жовтий продукт з молока' },
    { word: 'soep', hint: 'Рідка гаряча страва' },
    { word: 'thee', hint: 'Гарячий напій з листя' },
    { word: 'tijd', hint: 'Те що показує годинник' },
    { word: 'maan', hint: 'Світло вночі на небі' },
    { word: 'wind', hint: 'Рух повітря' },
    { word: 'hout', hint: 'Матеріал з деревини' },
    { word: 'vuur', hint: 'Гаряче полум\'я' },
    { word: 'land', hint: 'Країна або територія' },
    { word: 'stad', hint: 'Велике місто' },
    { word: 'veld', hint: 'Відкритий простір' },
    { word: 'meer', hint: 'Велика водойма' },
    { word: 'boom', hint: 'Високе рослина' },
    { word: 'ring', hint: 'Кругле прикраса' },
    { word: 'bank', hint: 'Місце для сидіння' },
    { word: 'hand', hint: 'Частина тіла для роботи' }
  ],
  5: [
    { word: 'tafel', hint: 'За чим їмо' },
    { word: 'stoel', hint: 'На чому сидимо' },
    { word: 'appel', hint: 'Фрукт червоний або зелений' },
    { word: 'fiets', hint: 'Два колеса і кермо' },
    { word: 'water', hint: 'П\'ємо щодня' },
    { word: 'brood', hint: 'Їмо на сніданок' },
    { word: 'suiker', hint: 'Солодка речовина' },
    { word: 'groen', hint: 'Колір трави' },
    { word: 'zwart', hint: 'Колір ночі' },
    { word: 'blauw', hint: 'Колір неба' },
    { word: 'bruin', hint: 'Колір землі' },
    { word: 'grijs', hint: 'Колір хмари' },
    { word: 'paars', hint: 'Колір винограду' }
  ],
  6: [
    { word: 'school', hint: 'Місце де вчаться діти' },
    { word: 'werken', hint: 'Те що роблять дорослі' },
    { word: 'vriend', hint: 'Хороша знайома людина' },
    { word: 'leraar', hint: 'Вчить в школі' },
    { word: 'dokter', hint: 'Лікує людей' },
    { word: 'zuster', hint: 'Допомагає лікарю' },
    { word: 'bakker', hint: 'Пече хліб' },
    { word: 'muziek', hint: 'Звуки які приємно слухати' },
    { word: 'zingen', hint: 'Видавати мелодійні звуки' },
    { word: 'dansen', hint: 'Рухатися під музику' },
    { word: 'praten', hint: 'Спілкуватися голосом' },
    { word: 'kijken', hint: 'Бачити очима' },
    { word: 'slapen', hint: 'Відпочивати з закритими очима' },
    { word: 'drinken', hint: 'Вживати рідину' }
  ],
  7: [
    { word: 'weekend', hint: 'Субота і неділя' },
    { word: 'vandaag', hint: 'Цей самий день' },
    { word: 'familie', hint: 'Батьки і діти разом' }
  ]
};

export function getRandomWord(level: number): DutchWord {
  const words = dutchWordsByLevel[level as keyof typeof dutchWordsByLevel];
  if (!words || words.length === 0) {
    throw new Error(`No words found for level ${level}`);
  }
  
  // Фильтруем слова только нужной длины
  const validWords = words.filter(word => word.word.length === level);
  if (validWords.length === 0) {
    throw new Error(`No ${level}-letter words found for level ${level}`);
  }
  
  return validWords[Math.floor(Math.random() * validWords.length)];
}
