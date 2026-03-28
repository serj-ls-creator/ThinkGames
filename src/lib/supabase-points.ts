import { supabase } from './supabase';

export const POINTS_PER_LEVEL = 500;

// Чистая запись очков в Supabase
export const saveProgressToSupabase = async (userId: string, category: 'math' | 'ukrainian' | 'dutch', xp: number) => {
  try {
    const { data, error } = await supabase
      .from('game_progress')
      .upsert({
        user_id: userId,
        category,
        xp,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,category'
      });

    if (error) {
      console.error('Error saving progress:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in saveProgressToSupabase:', error);
    return { success: false, error };
  }
};

// Загрузка прогресса из Supabase
export const loadProgressFromSupabase = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('game_progress')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error loading progress:', error);
      return { success: false, error };
    }

    const progress = {
      math: 0,
      ukrainian: 0,
      dutch: 0
    };

    data?.forEach((item: any) => {
      if (item.category in progress) {
        progress[item.category as keyof typeof progress] = item.xp;
      }
    });

    return { success: true, data: progress };
  } catch (error) {
    console.error('Error in loadProgressFromSupabase:', error);
    return { success: false, error };
  }
};

// Получение уровня и прогресса
export const getLevelProgress = (xp: number) => {
  const currentLevel = Math.floor(xp / POINTS_PER_LEVEL) + 1;
  const xpInLevel = xp % POINTS_PER_LEVEL;
  const xpToNextLevel = POINTS_PER_LEVEL;
  
  return {
    currentLevel,
    xpInLevel,
    xpToNextLevel,
    progressPercentage: (xpInLevel / xpToNextLevel) * 100
  };
};

// Добавление XP и сохранение в Supabase
export const addXPAndSave = async (userId: string, category: 'math' | 'ukrainian' | 'dutch', amount: number) => {
  // Сначала загружаем текущий прогресс
  const { success, data } = await loadProgressFromSupabase(userId);
  
  if (!success || !data) {
    return { success: false, error: 'Failed to load current progress' };
  }

  const currentXP = data[category];
  const newXP = currentXP + amount;
  
  // Сохраняем новый прогресс
  return await saveProgressToSupabase(userId, category, newXP);
};
