export const POINTS_PER_LEVEL = 500;

export const updateCategoryXP = (category: 'math' | 'ukrainian' | 'dutch', amount: number) => {
  const key = `${category}_xp`;
  const currentXP = Number(localStorage.getItem(key) || 0);
  const newXP = currentXP + amount;
  localStorage.setItem(key, newXP.toString());
  
  // Обновляем общий прогресс для профиля
  const total = Number(localStorage.getItem('total_xp') || 0) + amount;
  localStorage.setItem('total_xp', total.toString());
  return newXP;
};

export const getCategoryXP = (category: 'math' | 'ukrainian' | 'dutch') => {
  return Number(localStorage.getItem(`${category}_xp`) || 0);
};

export const getCategoryLevel = (category: 'math' | 'ukrainian' | 'dutch') => {
  const xp = getCategoryXP(category);
  return Math.floor(xp / POINTS_PER_LEVEL) + 1;
};

export const getCategoryProgress = (category: 'math' | 'ukrainian' | 'dutch') => {
  const xp = getCategoryXP(category);
  const progressInLevel = xp % POINTS_PER_LEVEL;
  return {
    current: progressInLevel,
    total: POINTS_PER_LEVEL,
    percentage: (progressInLevel / POINTS_PER_LEVEL) * 100,
    level: getCategoryLevel(category)
  };
};
