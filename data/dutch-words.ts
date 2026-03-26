export interface DutchLevel {
  level: number
  pairs: { left: string; right: string }[]
}

export const dutchLevels: DutchLevel[] = [
  {
    level: 1,
    pairs: [
      { left: "huis", right: "будинок" },
      { left: "boek", right: "книга" },
      { left: "tafel", right: "стіл" },
      { left: "stoel", right: "стілець" },
      { left: "deur", right: "двері" },
      { left: "raam", right: "вікно" },
      { left: "water", right: "вода" },
      { left: "brood", right: "хліб" },
      { left: "melk", right: "молоко" },
      { left: "appel", right: "яблуко" }
    ]
  },
  {
    level: 2,
    pairs: [
      { left: "school", right: "школа" },
      { left: "leraar", right: "вчитель" },
      { left: "student", right: "учень" },
      { left: "boekentas", right: "портфель" },
      { left: "pen", right: "ручка" },
      { left: "papier", right: "папір" },
      { left: "bord", right: "дошка" },
      { left: "les", right: "урок" },
      { left: "huiswerk", right: "домашнє завдання" },
      { left: "pauze", right: "перерва" }
    ]
  },
  {
    level: 3,
    pairs: [
      { left: "familie", right: "сім'я" },
      { left: "vader", right: "батько" },
      { left: "moeder", right: "мати" },
      { left: "zoon", right: "син" },
      { left: "dochter", right: "донька" },
      { left: "broer", right: "брат" },
      { left: "zus", right: "сестра" },
      { left: "opa", right: "дідусь" },
      { left: "oma", right: "бабуся" },
      { left: "kind", right: "дитина" }
    ]
  },
  {
    level: 4,
    pairs: [
      { left: "dier", right: "тварина" },
      { left: "hond", right: "собака" },
      { left: "kat", right: "кіт" },
      { left: "paard", right: "кінь" },
      { left: "koe", right: "корова" },
      { left: "varken", right: "свиня" },
      { left: "schaap", right: "вівця" },
      { left: "kip", right: "курка" },
      { left: "vis", right: "риба" },
      { left: "vogel", right: "птах" }
    ]
  },
  {
    level: 5,
    pairs: [
      { left: "kleur", right: "колір" },
      { left: "rood", right: "червоний" },
      { left: "blauw", right: "синій" },
      { left: "groen", right: "зелений" },
      { left: "geel", right: "жовтий" },
      { left: "zwart", right: "чорний" },
      { left: "wit", right: "білий" },
      { left: "oranje", right: "помаранчевий" },
      { left: "paars", right: "фіолетовий" },
      { left: "bruin", right: "коричневий" }
    ]
  },
  {
    level: 6,
    pairs: [
      { left: "getal", right: "число" },
      { left: "een", right: "один" },
      { left: "twee", right: "два" },
      { left: "drie", right: "три" },
      { left: "vier", right: "чотири" },
      { left: "vijf", right: "п'ять" },
      { left: "zes", right: "шість" },
      { left: "zeven", right: "сім" },
      { left: "acht", right: "вісім" },
      { left: "negen", right: "дев'ять" }
    ]
  },
  {
    level: 7,
    pairs: [
      { left: "eten", right: "їжа" },
      { left: "ontbijt", right: "сніданок" },
      { left: "lunch", right: "обід" },
      { left: "avondeten", right: "вечеря" },
      { left: "fruit", right: "фрукти" },
      { left: "groente", right: "овочі" },
      { left: "vlees", right: "м'ясо" },
      { left: "vis", right: "риба" },
      { left: "rijst", right: "рис" },
      { left: "pasta", right: "паста" }
    ]
  },
  {
    level: 8,
    pairs: [
      { left: "kleding", right: "одяг" },
      { left: "hemd", right: "сорочка" },
      { left: "broek", right: "штани" },
      { left: "jas", right: "піджак" },
      { left: "schoen", right: "взуття" },
      { left: "hoed", right: "капелюх" },
      { left: "sok", right: "шкарпетка" },
      { left: "jurk", right: "сукня" },
      { left: "riem", right: "ремінь" },
      { left: "handschoen", right: "рукавичка" }
    ]
  },
  {
    level: 9,
    pairs: [
      { left: "weer", right: "погода" },
      { left: "zon", right: "сонце" },
      { left: "regen", right: "дощ" },
      { left: "wind", right: "вітер" },
      { left: "sneeuw", right: "сніг" },
      { left: "wolk", right: "хмара" },
      { left: "warm", right: "тепло" },
      { left: "koud", right: "холодно" },
      { left: "nat", right: "волого" },
      { left: "droog", right: "сухо" }
    ]
  },
  {
    level: 10,
    pairs: [
      { left: "tijd", right: "час" },
      { left: "uur", right: "година" },
      { left: "minuut", right: "хвилина" },
      { left: "dag", right: "день" },
      { left: "week", right: "тиждень" },
      { left: "maand", right: "місяць" },
      { left: "jaar", right: "рік" },
      { left: "ochtend", right: "ранок" },
      { left: "middag", right: "день" },
      { left: "avond", right: "вечір" }
    ]
  }
]
