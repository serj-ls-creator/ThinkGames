import { supabase } from './supabase';

export const POINTS_PER_LEVEL = 500;

// Асинхронная функция обновления XP пользователя
export const updateUserXP = async (userId: string, category: 'math' | 'ukrainian' | 'dutch', amount: number) => {
  try {
    // Сначала получаем текущее значение XP
    const { data: currentData, error: fetchError } = await supabase
      .from('game_progress')
      .select('xp')
      .eq('user_id', userId)
      .eq('category', category)
      .single();

    let newXP = amount;
    
    if (!fetchError && currentData) {
      // Если запись существует, добавляем к текущему значению
      newXP = currentData.xp + amount;
    }

    // Вставляем или обновляем запись в game_progress
    const { data, error } = await supabase
      .from('game_progress')
      .upsert({
        user_id: userId,
        category,
        xp: newXP,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,category'
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating user XP:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in updateUserXP:', error);
    return { success: false, error };
  }
};

// Функция получения статистики пользователя из представления user_stats
export const getUserStats = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user stats:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in getUserStats:', error);
    return { success: false, error };
  }
};

// Получение уровня и прогресса из XP
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

// Добавление XP с бонусной системой
export const addXPWithBonus = async (userId: string, category: 'math' | 'ukrainian' | 'dutch', amount: number, isCleanGame: boolean = false) => {
  const totalAmount = isCleanGame ? amount + 10 : amount; // +10 XP бонус за чистую игру
  
  return await updateUserXP(userId, category, totalAmount);
};
