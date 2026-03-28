export const POINTS_PER_LEVEL = 500;

// Получение ID пользователя из контекста или генерация session_id
const getUserId = (user?: any) => {
  if (user?.id) {
    return user.id;
  }
  // Анонимный пользователь - используем session_id
  let sessionId = localStorage.getItem('anonymous_session_id');
  if (!sessionId) {
    sessionId = 'anon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('anonymous_session_id', sessionId);
  }
  return sessionId;
};

export const updateCategoryXP = (category: 'math' | 'ukrainian' | 'dutch', amount: number, user?: any) => {
  const userId = getUserId(user);
  const key = `${category}_xp_${userId}`;
  const currentXP = Number(localStorage.getItem(key) || 0);
  const newXP = currentXP + amount;
  localStorage.setItem(key, newXP.toString());
  
  // Обновляем общий прогресс для профиля
  const totalKey = `total_xp_${userId}`;
  const total = Number(localStorage.getItem(totalKey) || 0) + amount;
  localStorage.setItem(totalKey, total.toString());
  return newXP;
};

export const getCategoryXP = (category: 'math' | 'ukrainian' | 'dutch', user?: any) => {
  const userId = getUserId(user);
  return Number(localStorage.getItem(`${category}_xp_${userId}`) || 0);
};

export const getCategoryLevel = (category: 'math' | 'ukrainian' | 'dutch', user?: any) => {
  const xp = getCategoryXP(category, user);
  return Math.floor(xp / POINTS_PER_LEVEL) + 1;
};

export const getCategoryProgress = (category: 'math' | 'ukrainian' | 'dutch', user?: any) => {
  const xp = getCategoryXP(category, user);
  const progressInLevel = xp % POINTS_PER_LEVEL;
  return {
    current: progressInLevel,
    total: POINTS_PER_LEVEL,
    percentage: (progressInLevel / POINTS_PER_LEVEL) * 100,
    level: getCategoryLevel(category, user)
  };
};

// Проверка, авторизован ли пользователь
export const isUserAuthenticated = (user: any) => {
  return !!user?.id;
};

// Сохранение прогресса в Supabase (будет реализовано позже)
export const saveProgressToSupabase = async (category: string, xp: number, user?: any) => {
  if (!isUserAuthenticated(user)) {
    return { success: false, message: 'User not authenticated' };
  }
  
  try {
    // TODO: Реализовать сохранение в Supabase
    // const { data, error } = await supabase
    //   .from('game_progress')
    //   .upsert({
    //     user_id: user.id,
    //     category,
    //     xp,
    //     updated_at: new Date().toISOString()
    //   });
    
    return { success: true, message: 'Progress saved to Supabase' };
  } catch (error) {
    return { success: false, message: 'Failed to save progress' };
  }
};
